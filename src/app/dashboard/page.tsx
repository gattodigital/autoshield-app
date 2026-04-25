import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Car, Shield, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const [savedCars, policies, quotes] = await Promise.all([
    prisma.savedCar.count({ where: { userId: session.user.id } }),
    prisma.policy.findMany({
      where: { userId: session.user.id },
      include: { car: true, plan: { include: { provider: true } } },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.insuranceQuote.findMany({
      where: { userId: session.user.id },
      include: { car: true, plan: { include: { provider: true } } },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const activePolicies = policies.filter((p) => p.status === 'ACTIVE')
  const monthlySpend = activePolicies.reduce((sum, p) => sum + p.monthlyPremium, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your AutoShield account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Saved Cars', value: savedCars, icon: Car, color: 'bg-blue-100 text-blue-600', href: '/dashboard/cars' },
          { label: 'Active Policies', value: activePolicies.length, icon: Shield, color: 'bg-green-100 text-green-600', href: '/dashboard/insurance' },
          { label: 'Pending Quotes', value: quotes.length, icon: Clock, color: 'bg-orange-100 text-orange-600', href: '/dashboard/insurance' },
          { label: 'Monthly Cost', value: `$${monthlySpend}`, icon: TrendingUp, color: 'bg-purple-100 text-purple-600', href: '/dashboard/insurance' },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-[#1e3a5f]/30 transition-colors">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Active Policies */}
      {activePolicies.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Policies</h2>
            <Link href="/dashboard/insurance" className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {activePolicies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{policy.plan.name}</p>
                    <p className="text-sm text-gray-500">{policy.car.year} {policy.car.make} {policy.car.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">${policy.monthlyPremium}/mo</p>
                  <p className="text-xs text-gray-500">Expires {formatDate(policy.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] text-white rounded-xl p-8">
          <Shield className="h-12 w-12 text-[#f97316] mb-4" />
          <h2 className="text-xl font-bold mb-2">You don&apos;t have any active policies</h2>
          <p className="text-white/70 mb-6">Protect your vehicle with comprehensive coverage from just $35/month</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/insurance/quote">
              <Button variant="orange" className="gap-2">
                <Shield className="h-4 w-4" /> Get Insured Now
              </Button>
            </Link>
            <Link href="/insurance">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent quotes */}
      {quotes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Quotes</h2>
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{quote.plan.name}</p>
                  <p className="text-sm text-gray-500">{quote.car.year} {quote.car.make} {quote.car.model} · {formatDate(quote.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${quote.monthlyPremium}/mo</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : quote.status === 'DECLINED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/cars" className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#1e3a5f]/30 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-[#1e3a5f]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Browse Cars</p>
              <p className="text-sm text-gray-500">Find your next vehicle</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1e3a5f] transition-colors" />
        </Link>
        <Link href="/insurance/quote" className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#f97316]/30 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f97316]/10 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#f97316]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Get a Quote</p>
              <p className="text-sm text-gray-500">Compare insurance plans</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#f97316] transition-colors" />
        </Link>
      </div>
    </div>
  )
}
