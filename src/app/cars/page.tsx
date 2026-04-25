import { prisma } from '@/lib/db'
import CarCard from '@/components/features/CarCard'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, Car } from 'lucide-react'

interface SearchParams {
  search?: string
  make?: string
  bodyType?: string
  condition?: string
  fuelType?: string
  priceMin?: string
  priceMax?: string
  yearMin?: string
  yearMax?: string
  page?: string
}

const MAKES = ['All Makes', 'Toyota', 'Honda', 'Ford', 'BMW', 'Tesla', 'Chevrolet', 'Hyundai', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Subaru', 'Nissan', 'Jeep', 'Porsche', 'Kia', 'Mazda', 'Lexus', 'Ram', 'Volvo']
const BODY_TYPES = ['All Types', 'Sedan', 'SUV', 'Truck', 'Wagon', 'Coupe', 'Convertible', 'Van']
const CONDITIONS = ['All Conditions', 'NEW', 'USED', 'CERTIFIED']

async function getCars(params: SearchParams) {
  const page = parseInt(params.page ?? '1')
  const pageSize = 12
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { status: 'AVAILABLE' }

  if (params.search) {
    where.OR = [
      { make: { contains: params.search } },
      { model: { contains: params.search } },
      { description: { contains: params.search } },
    ]
  }
  if (params.make && params.make !== 'All Makes') where.make = params.make
  if (params.bodyType && params.bodyType !== 'All Types') where.bodyType = params.bodyType
  if (params.condition && params.condition !== 'All Conditions') where.condition = params.condition
  if (params.fuelType) where.fuelType = params.fuelType
  if (params.priceMin || params.priceMax) {
    where.price = {}
    if (params.priceMin) (where.price as Record<string, number>).gte = parseFloat(params.priceMin)
    if (params.priceMax) (where.price as Record<string, number>).lte = parseFloat(params.priceMax)
  }
  if (params.yearMin || params.yearMax) {
    where.year = {}
    if (params.yearMin) (where.year as Record<string, number>).gte = parseInt(params.yearMin)
    if (params.yearMax) (where.year as Record<string, number>).lte = parseInt(params.yearMax)
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: pageSize,
      include: { dealer: { select: { name: true, email: true, id: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.car.count({ where }),
  ])

  return { cars, total, pages: Math.ceil(total / pageSize), page }
}

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const { cars, total, pages, page } = await getCars(searchParams)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Browse Cars</h1>
          <p className="text-white/70">{total.toLocaleString()} vehicles available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <form method="GET" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                defaultValue={searchParams.search}
                placeholder="Search make, model, or keyword..."
                className="pl-10"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Select name="make" defaultValue={searchParams.make}>
                {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Select name="bodyType" defaultValue={searchParams.bodyType}>
                {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Select name="condition" defaultValue={searchParams.condition}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Input name="priceMin" defaultValue={searchParams.priceMin} placeholder="Min Price" type="number" />
              <Input name="priceMax" defaultValue={searchParams.priceMax} placeholder="Max Price" type="number" />
              <Input name="yearMin" defaultValue={searchParams.yearMin} placeholder="Min Year" type="number" />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="default" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Apply Filters
              </Button>
              <a href="/cars">
                <Button type="button" variant="secondary">Clear All</Button>
              </a>
            </div>
          </form>
        </div>

        {/* Results */}
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No cars found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams()
              if (searchParams.search) params.set('search', searchParams.search)
              if (searchParams.make) params.set('make', searchParams.make)
              params.set('page', p.toString())
              return (
                <a
                  key={p}
                  href={`/cars?${params.toString()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {p}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
