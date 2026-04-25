import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { carId, planId } = body

    if (!carId || !planId) {
      return NextResponse.json({ error: 'carId and planId are required' }, { status: 400 })
    }

    const plan = await prisma.insurancePlan.findUnique({ where: { id: planId } })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    // Calculate personalized premium (simple algorithm)
    const accidents = parseInt(body.accidents ?? '0') || 0
    const yearsLicensed = parseInt(body.yearsLicensed ?? '5') || 5
    let premium = plan.monthlyPremium

    // Adjust for risk factors
    if (accidents > 0) premium *= 1.2 + accidents * 0.1
    if (yearsLicensed < 2) premium *= 1.15
    if (yearsLicensed > 10) premium *= 0.9

    premium = Math.round(premium)

    if (session?.user?.id) {
      const quote = await prisma.insuranceQuote.create({
        data: {
          userId: session.user.id,
          carId,
          planId,
          monthlyPremium: premium,
        },
      })
      return NextResponse.json({ ...quote, monthlyPremium: premium })
    }

    return NextResponse.json({ monthlyPremium: premium, planId, carId })
  } catch (error) {
    console.error('Quote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quotes = await prisma.insuranceQuote.findMany({
    where: { userId: session.user.id },
    include: { car: true, plan: { include: { provider: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ quotes })
}
