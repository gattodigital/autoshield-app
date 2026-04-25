import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function DashboardInsurancePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const [policies, quotes] = await Promise.all([
    prisma.policy.findMany({
      where: { userId: session.user.id },
      include: { car: true, plan: { include: { provider: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.insuranceQuote.findMany({
      where: { userId: session.user.id },
      include: { car: true, plan: { include: { provider: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const statusColors: Record<string, string> = {
    ACTIVE: 'success',
    EXPIRED: 'secondary',
    CANCELLED: 'destructive',
    PENDING: 'warning',
    ACCEPTED: 'success',
    DECLINED: 'destructive',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Insurance</h1>
          <p className="text-gray-500 mt-1">Manage your policies and quotes</p>
        </div>
        <Link href="/insurance/quote">
          <Button variant="orange" className="gap-2">
            <Shield className="h-4 w-4" /> New Quote
          </Button>
        </Link>
      </div>

      {/* Policies */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Policies</h2>
        {policies.length === 0 ? (
          <div className="text-center py-10">
            <Shield className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No policies yet</p>
            <Link href="/insurance/quote" className="mt-4 inline-block">
              <Button variant="default" size="sm">Get Your First Policy</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${policy.status === 'ACTIVE' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {policy.status === 'ACTIVE' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{policy.plan.name}</p>
                      <p className="text-sm text-gray-500">{policy.car.year} {policy.car.make} {policy.car.model}</p>
                      <p className="text-xs text-gray-400">Policy #{policy.policyNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={(statusColors[policy.status] as 'success' | 'secondary' | 'destructive' | 'warning') ?? 'secondary'}>
                      {policy.status}
                    </Badge>
                    <p className="font-bold text-gray-900 mt-1">${policy.monthlyPremium}/mo</p>
                  </div>
                </div>
                <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>Provider: <strong>{policy.plan.provider.name}</strong></span>
                  <span>Start: {formatDate(policy.startDate)}</span>
                  <span>Expires: {formatDate(policy.endDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Quotes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quote History</h2>
        {quotes.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No quotes yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div key={quote.id} className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-xl gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{quote.plan.name}</p>
                  <p className="text-sm text-gray-500">{quote.car.year} {quote.car.make} {quote.car.model} · {formatDate(quote.createdAt)}</p>
                  <p className="text-xs text-gray-400">{quote.plan.provider.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={(statusColors[quote.status] as 'success' | 'secondary' | 'destructive' | 'warning') ?? 'secondary'}>
                    {quote.status}
                  </Badge>
                  <span className="font-bold text-gray-900">${quote.monthlyPremium}/mo</span>
                  {quote.status === 'PENDING' && (
                    <Link href={`/insurance/quote?planId=${quote.planId}&carId=${quote.carId}`}>
                      <Button size="sm" variant="orange" className="gap-1">
                        Accept <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-[#f97316]" />
          <h3 className="font-bold">Upgrade Your Coverage</h3>
        </div>
        <p className="text-white/70 text-sm mb-4">You could save up to $300/year by bundling multiple policies or switching to a higher coverage plan.</p>
        <Link href="/insurance">
          <Button variant="orange" size="sm" className="gap-1">
            Compare Plans <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
