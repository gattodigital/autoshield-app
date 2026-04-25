import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatPrice, formatMileage, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CarCard from '@/components/features/CarCard'
import { Shield, Car, Gauge, Settings, Fuel, Calendar, MapPin, Phone, Mail, CheckCircle, ArrowLeft, Star } from 'lucide-react'

async function getCar(id: string) {
  return prisma.car.findUnique({
    where: { id },
    include: { dealer: { select: { name: true, email: true, id: true, phone: true } } },
  })
}

async function getRelatedCars(make: string, id: string) {
  return prisma.car.findMany({
    where: { make, id: { not: id }, status: 'AVAILABLE' },
    take: 3,
    include: { dealer: { select: { name: true, email: true, id: true, phone: true } } },
  })
}

const conditionColors: Record<string, 'success' | 'orange' | 'secondary'> = {
  NEW: 'success',
  CERTIFIED: 'orange',
  USED: 'secondary',
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await getCar(params.id)
  if (!car) notFound()

  const relatedCars = await getRelatedCars(car.make, car.id)
  const images = JSON.parse(car.images) as string[]
  const insuranceEstimate = Math.round(car.price / 500)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/cars" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative h-80 md:h-96">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Car className="h-20 w-20 text-gray-300" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#1e3a5f] transition-colors">
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title + Condition */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={conditionColors[car.condition] ?? 'secondary'}>
                      {car.condition === 'CERTIFIED' ? 'Certified Pre-Owned' : car.condition}
                    </Badge>
                    <Badge variant="secondary">{car.bodyType}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <p className="text-gray-500 mt-1">{car.color} · VIN: {car.vin}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#f97316]">{formatPrice(car.price)}</div>
                  <p className="text-sm text-gray-500 mt-1">Est. {formatPrice(car.price / 60)}/mo</p>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Specs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  { icon: Settings, label: 'Transmission', value: car.transmission },
                  { icon: Car, label: 'Body Type', value: car.bodyType },
                  { icon: MapPin, label: 'Color', value: car.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-[#1e3a5f]" />
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Features highlights */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Advanced Safety Systems', 'Backup Camera', 'Apple CarPlay / Android Auto',
                  'Lane Departure Warning', 'Blind Spot Monitoring', 'Heated Seats',
                  'Keyless Entry', 'Push-Button Start',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Actions + Insurance + Dealer */}
          <div className="space-y-6">
            {/* Price + CTA */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-20">
              <div className="text-3xl font-bold text-[#1e3a5f] mb-1">{formatPrice(car.price)}</div>
              <p className="text-sm text-gray-500 mb-4">Listed {formatDate(car.createdAt)}</p>
              <div className="space-y-3">
                <Link href={`/insurance/quote?carId=${car.id}`} className="block">
                  <Button variant="orange" size="lg" className="w-full gap-2">
                    <Shield className="h-5 w-5" />
                    Get Insurance Quote
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Dealer
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  Schedule Test Drive
                </Button>
              </div>
            </div>

            {/* Insurance CTA — KEY BUSINESS FEATURE */}
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-6 w-6 text-[#f97316]" />
                <h3 className="font-bold text-lg">Protect This Car</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Get comprehensive insurance coverage starting from just{' '}
                <span className="text-[#f97316] font-bold">${insuranceEstimate}/month</span>
              </p>
              <ul className="space-y-2 mb-4">
                {['Instant quote in 2 minutes', 'Coverage starts today', 'Save up to 30% vs competitors'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-[#f97316]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/insurance/quote?carId=${car.id}`} className="block">
                <Button variant="orange" className="w-full gap-2">
                  <Shield className="h-4 w-4" />
                  Get Free Quote
                </Button>
              </Link>
            </div>

            {/* Dealer Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
                  {car.dealer.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{car.dealer.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">4.8 rating</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {car.dealer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-[#1e3a5f]" />
                    {car.dealer.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-[#1e3a5f]" />
                  {car.dealer.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related cars */}
        {relatedCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More {car.make} Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCars.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
