import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { dealer: { select: { name: true, email: true, id: true, phone: true } } },
  })

  if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })
  return NextResponse.json(car)
}
