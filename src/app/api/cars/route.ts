import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
  const search = searchParams.get('search')
  const make = searchParams.get('make')
  const bodyType = searchParams.get('bodyType')
  const condition = searchParams.get('condition')

  const where: Record<string, unknown> = { status: 'AVAILABLE' }
  if (search) {
    where.OR = [
      { make: { contains: search } },
      { model: { contains: search } },
    ]
  }
  if (make && make !== 'All Makes') where.make = make
  if (bodyType && bodyType !== 'All Types') where.bodyType = bodyType
  if (condition && condition !== 'All Conditions') where.condition = condition

  try {
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { dealer: { select: { name: true, id: true, email: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where }),
    ])

    return NextResponse.json({ cars, total, pages: Math.ceil(total / pageSize) })
  } catch {
    return NextResponse.json({ cars: [], total: 0, pages: 0 })
  }
}
