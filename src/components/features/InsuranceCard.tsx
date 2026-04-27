import { InsurancePlan, InsuranceProvider } from '@prisma/client'
import { Check, Star, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface InsuranceCardProps {
  plan: InsurancePlan & { provider: InsuranceProvider }
  featured?: boolean
  carId?: string
}

const typeColors: Record<string, string> = {
  LIABILITY: 'bg-blue-100 text-blue-800',
  COMPREHENSIVE: 'bg-purple-100 text-purple-800',
  COLLISION: 'bg-orange-100 text-orange-800',
  FULL_COVERAGE: 'bg-green-100 text-green-800',
}

const typeLabels: Record<string, string> = {
  LIABILITY: 'Liability',
  COMPREHENSIVE: 'Comprehensive',
  COLLISION: 'Collision',
  FULL_COVERAGE: 'Full Coverage',
}

export default function InsuranceCard({ plan, featured, carId }: InsuranceCardProps) {
  const features = JSON.parse(plan.features) as string[]
  const quoteUrl = `/insurance/quote${carId ? `?carId=${carId}&planId=${plan.id}` : `?planId=${plan.id}`}`

  return (
    <div className={`relative rounded-xl border bg-white overflow-hidden transition-shadow hover:shadow-md ${featured ? 'border-[#f97316] shadow-lg ring-2 ring-[#f97316]/20' : 'border-gray-200 shadow-sm'}`}>
      {featured && (
        <div className="bg-[#f97316] text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className="p-6">
        {/* Provider */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {plan.provider.logo}
            </div>
            <div>
              <p className="text-xs text-gray-500">{plan.provider.name}</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(plan.provider.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">{plan.provider.rating}</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[plan.type] ?? 'bg-gray-100 text-gray-800'}`}>
            {typeLabels[plan.type] ?? plan.type}
          </span>
        </div>

        {/* Name & Price */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
        <div className="flex items-end gap-1 mb-4">
          <span className="text-3xl font-bold text-[#1e3a5f]">${plan.monthlyPremium}</span>
          <span className="text-gray-500 mb-1">/month</span>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Deductible</p>
            <p className="font-semibold text-gray-900">${plan.deductible.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Coverage Limit</p>
            <p className="font-semibold text-gray-900">${(plan.coverageLimit / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Link href={quoteUrl} className="block">
          <Button variant={featured ? 'orange' : 'default'} className="w-full gap-2">
            <Shield className="h-4 w-4" />
            Get This Plan
          </Button>
        </Link>
      </div>
    </div>
  )
}
