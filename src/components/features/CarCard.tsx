import Link from 'next/link'
import Image from 'next/image'
import { Car } from '@prisma/client'
import { Fuel, Gauge, Settings, Calendar, Shield, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatMileage } from '@/lib/utils'

interface CarCardProps {
  car: Car & { dealer?: { name: string } }
  onSave?: (carId: string) => void
  isSaved?: boolean
}

const conditionColors: Record<string, 'success' | 'default' | 'orange'> = {
  NEW: 'success',
  CERTIFIED: 'orange',
  USED: 'default',
}

export default function CarCard({ car, onSave, isSaved }: CarCardProps) {
  const images = JSON.parse(car.images) as string[]
  const primaryImage = images[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Settings className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={conditionColors[car.condition] ?? 'secondary'}>
            {car.condition === 'CERTIFIED' ? 'Certified Pre-Owned' : car.condition}
          </Badge>
        </div>
        {onSave && (
          <button
            onClick={() => onSave(car.id)}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition-transform"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {car.year} {car.make} {car.model}
          </h3>
          <span className="text-[#f97316] font-bold text-xl ml-2 shrink-0">
            {formatPrice(car.price)}
          </span>
        </div>

        {car.color && (
          <p className="text-sm text-gray-500 mb-3">{car.color}</p>
        )}

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Gauge className="h-3.5 w-3.5 text-gray-400" />
            {formatMileage(car.mileage)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Settings className="h-3.5 w-3.5 text-gray-400" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Fuel className="h-3.5 w-3.5 text-gray-400" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {car.year}
          </div>
        </div>

        {/* Insurance CTA */}
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-orange-700">
            <Shield className="h-3.5 w-3.5" />
            <span className="font-medium">Insurance from ${Math.round(car.price / 500)}/mo</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/cars/${car.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/insurance/quote?carId=${car.id}`}>
            <Button variant="orange" size="sm">
              <Shield className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
