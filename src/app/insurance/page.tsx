import { prisma } from '@/lib/db'
import InsuranceCard from '@/components/features/InsuranceCard'
import { Shield, CheckCircle, TrendingDown, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getPlansWithProviders() {
  return prisma.insurancePlan.findMany({
    include: { provider: true },
    orderBy: { monthlyPremium: 'asc' },
  })
}

const benefits = [
  { icon: Shield, title: 'Comprehensive Protection', desc: 'Coverage for accidents, theft, natural disasters, and more.' },
  { icon: TrendingDown, title: 'Best-in-Class Rates', desc: 'We negotiate with 15+ insurers to get you the lowest premiums.' },
  { icon: Clock, title: 'Instant Coverage', desc: 'Apply online and get insured within minutes. No waiting.' },
  { icon: Award, title: 'Trusted Providers', desc: 'All our insurance partners are AM Best A-rated or higher.' },
]

const faqs = [
  { q: 'How quickly can I get insured?', a: 'With AutoShield, you can get a quote in under 2 minutes and have active coverage within the same day.' },
  { q: 'Can I insure any car on the platform?', a: 'Yes! Our insurance quotes are pre-configured for every vehicle listed, making the process seamless.' },
  { q: 'What is the difference between liability and full coverage?', a: 'Liability covers damage you cause to others. Full coverage also protects your own vehicle from accidents, theft, and weather.' },
  { q: 'Can I cancel my policy anytime?', a: 'Yes. All our insurance plans can be cancelled at any time with no early cancellation fees.' },
]

export default async function InsurancePage() {
  const plans = await getPlansWithProviders()

  const featuredPlans = plans.filter((p) => p.type === 'COMPREHENSIVE').slice(0, 3)
  const allPlans = plans.slice(0, 9)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/30 rounded-full px-4 py-2 text-sm text-orange-200 mb-6">
            <Shield className="h-4 w-4" />
            Trusted by 50,000+ drivers
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Car Insurance<br />
            <span className="text-[#f97316]">Made Simple</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Compare plans from top-rated providers and get covered in minutes. Save an average of $2,400 per year.
          </p>
          <Link href="/insurance/quote">
            <Button variant="orange" size="xl" className="gap-2">
              <Shield className="h-5 w-5" />
              Get Your Free Quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why AutoShield Insurance?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#1e3a5f]/10 rounded-xl p-4">
                    <Icon className="h-7 w-7 text-[#1e3a5f]" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Coverage Types</h2>
            <p className="text-gray-500 mt-2">Choose the protection level that&apos;s right for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'Liability', icon: '🛡️', from: '$35', desc: 'State minimum required. Covers damages you cause to others.', features: ['Bodily injury liability', 'Property damage', 'Legal defense'] },
              { type: 'Collision', icon: '🚗', from: '$65', desc: 'Covers repair costs when you collide with another vehicle or object.', features: ['Collision damage', 'Hit-and-run', 'Single car accidents'] },
              { type: 'Comprehensive', icon: '🌟', from: '$79', desc: 'Full protection including theft, weather, and non-collision damage.', features: ['Theft protection', 'Weather damage', 'Animal collision'] },
              { type: 'Full Coverage', icon: '🏆', from: '$120', desc: 'The most complete protection available. Covers everything.', features: ['All above types', 'Gap insurance', 'New car replacement'] },
            ].map(({ type, icon, from, desc, features }) => (
              <div key={type} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{type}</h3>
                <p className="text-2xl font-bold text-[#f97316] mb-2">From {from}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500 mb-4">{desc}</p>
                <ul className="space-y-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Plans</h2>
            <p className="text-gray-500 mt-2">Our most-chosen comprehensive coverage plans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlans.map((plan, i) => (
              <InsuranceCard key={plan.id} plan={plan} featured={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* All Plans */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">All Available Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlans.map((plan) => (
              <InsuranceCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/insurance/quote">
              <Button variant="orange" size="lg" className="gap-2">
                <Shield className="h-5 w-5" />
                Get Personalized Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{q}</h4>
                <p className="text-sm text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#f97316] to-[#ea6c10] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-white/90" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-lg text-white/90 mb-8">Get your personalized insurance quote in under 2 minutes.</p>
          <Link href="/insurance/quote">
            <Button size="xl" className="bg-white text-[#f97316] hover:bg-gray-100">
              Start Your Free Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
