import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Shield, Car, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function DashboardCarsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const savedCars = await prisma.savedCar.findMany({
    where: { userId: session.user.id },
    include: { car: { include: { dealer: { select: { name: true, email: true, id: true, phone: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Cars</h1>
          <p className="text-gray-500 mt-1">{savedCars.length} saved vehicle{savedCars.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/cars">
          <Button variant="default" className="gap-2">
            <Car className="h-4 w-4" /> Browse More
          </Button>
        </Link>
      </div>

      {savedCars.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
          <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No saved cars yet</h3>
          <p className="text-gray-400 mt-2 mb-6">Browse our inventory and save cars you&apos;re interested in</p>
          <Link href="/cars">
            <Button variant="default">Browse Cars</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCars.map(({ car, id }) => {
            const images = JSON.parse(car.images) as string[]
            return (
              <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44">
                  {images[0] ? (
                    <Image src={images[0]} alt={`${car.year} ${car.make} ${car.model}`} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Car className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant={car.condition === 'NEW' ? 'success' : car.condition === 'CERTIFIED' ? 'orange' : 'secondary'}>
                      {car.condition}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{car.year} {car.make} {car.model}</h3>
                    <span className="text-[#f97316] font-bold">{formatPrice(car.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{formatMileage(car.mileage)} · {car.fuelType}</p>
                  <div className="flex gap-2">
                    <Link href={`/cars/${car.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">View Details</Button>
                    </Link>
                    <Link href={`/insurance/quote?carId=${car.id}`}>
                      <Button variant="orange" size="sm" className="gap-1">
                        <Shield className="h-3.5 w-3.5" /> Insure
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
