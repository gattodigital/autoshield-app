import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

const SOURCE_URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/cars.json'
const SOURCE_LABEL = 'vega-datasets/cars.json (BSD-3-Clause)'

const COLORS = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Orange',
]

const IMAGES = [
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200',
]

type OpenCar = {
  Name?: string
  Year?: string | number
  Horsepower?: number | null
  Weight_in_lbs?: number | null
  Miles_per_Gallon?: number | null
  Origin?: string | null
}

function toYear(input: string | number | undefined): number {
  if (typeof input === 'number') return input
  if (!input) return 2018
  const parsed = new Date(input)
  if (!Number.isNaN(parsed.getTime())) return parsed.getUTCFullYear()
  const asNumber = Number.parseInt(input, 10)
  return Number.isFinite(asNumber) ? asNumber : 2018
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function hashString(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function vinFromKey(key: string): string {
  // Build a deterministic, VIN-safe 17-char token (no I/O/Q).
  const alphabet = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
  const hash = hashString(key)
  let vin = ''
  for (let i = 0; i < 17; i += 1) {
    const chunk = hash.slice(i * 2, i * 2 + 2)
    const index = Number.parseInt(chunk, 16) % alphabet.length
    vin += alphabet[index]
  }
  return vin
}

function pickFromHash<T>(key: string, values: T[]): T {
  const hash = hashString(key)
  const idx = Number.parseInt(hash.slice(0, 8), 16) % values.length
  return values[idx]
}

function parseMakeModel(name: string): { make: string; model: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return { make: parts[0] || 'Unknown', model: 'Base' }
  return { make: parts[0], model: parts.slice(1).join(' ') }
}

function estimatePrice(car: OpenCar, year: number): number {
  const hp = car.Horsepower ?? 120
  const mpg = car.Miles_per_Gallon ?? 24
  const agePenalty = Math.max(0, 2026 - year) * 420
  const performanceBump = hp * 120
  const efficiencyBump = mpg * 80
  return clamp(Math.round(5500 + performanceBump + efficiencyBump - agePenalty), 3500, 95000)
}

function estimateMileage(year: number): number {
  const age = Math.max(0, 2026 - year)
  return clamp(age * 11000 + 12000, 6000, 240000)
}

function conditionFromYear(year: number): 'NEW' | 'USED' | 'CERTIFIED' {
  if (year >= 2025) return 'NEW'
  if (year >= 2021) return 'CERTIFIED'
  return 'USED'
}

function fuelFromMpg(mpg: number | null | undefined): string {
  if (!mpg) return 'Gasoline'
  if (mpg >= 38) return 'Hybrid'
  return 'Gasoline'
}

async function main() {
  console.log(`Importing open inventory from ${SOURCE_LABEL}`)

  const response = await fetch(SOURCE_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.status} ${response.statusText}`)
  }

  const raw = (await response.json()) as OpenCar[]
  const records = raw.filter((c) => c.Name && c.Year)

  const dealerPassword = await bcrypt.hash('dealer123', 10)
  const dealer = await prisma.user.upsert({
    where: { email: 'opensource-dealer@autoshield.com' },
    update: {},
    create: {
      name: 'Open Source Dealer',
      email: 'opensource-dealer@autoshield.com',
      password: dealerPassword,
      role: 'DEALER',
      phone: '(555) 111-2233',
    },
  })

  let inserted = 0
  for (const item of records) {
    const name = item.Name as string
    const year = toYear(item.Year)
    const key = `${name}-${year}-${item.Origin ?? 'NA'}`
    const { make, model } = parseMakeModel(name)

    const carData = {
      make,
      model,
      year,
      price: estimatePrice(item, year),
      mileage: estimateMileage(year),
      color: pickFromHash(key, COLORS),
      vin: vinFromKey(key),
      description: `${name} sourced from open-source inventory dataset (${SOURCE_LABEL}).`,
      images: JSON.stringify([pickFromHash(key + '-image', IMAGES)]),
      condition: conditionFromYear(year),
      transmission: pickFromHash(key + '-trans', ['Automatic', 'Manual']),
      fuelType: fuelFromMpg(item.Miles_per_Gallon),
      bodyType: pickFromHash(key + '-body', ['Sedan', 'SUV', 'Coupe', 'Wagon']),
      dealerId: dealer.id,
      status: 'AVAILABLE',
    } as const

    await prisma.car.upsert({
      where: { vin: carData.vin },
      update: {
        price: carData.price,
        mileage: carData.mileage,
        description: carData.description,
        images: carData.images,
        status: carData.status,
      },
      create: carData,
    })

    inserted += 1
  }

  console.log(`Open inventory import completed. Upserted ${inserted} vehicles.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
