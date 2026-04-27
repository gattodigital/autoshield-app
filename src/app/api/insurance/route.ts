import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const plans = await prisma.insurancePlan.findMany({
    include: { provider: true },
    orderBy: { monthlyPremium: 'asc' },
  })
  return NextResponse.json({ plans })
}
