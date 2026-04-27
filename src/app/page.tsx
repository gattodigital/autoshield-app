import Link from 'next/link'
import { Shield, Car, CheckCircle, Star, ArrowRight, Search, TrendingDown, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import CarCard from '@/components/features/CarCard'

async function getFeaturedCars() {
  return prisma.car.findMany({
    take: 6,
    where: { status: 'AVAILABLE' },
    include: { dealer: { select: { name: true, email: true, id: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

const stats = [
  { value: '50,000+', label: 'Cars Listed', icon: Car },
  { value: '15+', label: 'Insurance Partners', icon: Shield },
  { value: '98%', label: 'Customer Satisfaction', icon: Star },
  { value: '$2,400', label: 'Average Annual Savings', icon: TrendingDown },
]

const features = [
  { icon: Search, title: 'Smart Search', desc: 'Advanced filters to find exactly the car you want from thousands of listings.' },
  { icon: Shield, title: 'Instant Insurance', desc: 'Get competitive insurance quotes the moment you find your dream car.' },
  { icon: Award, title: 'Certified Quality', desc: 'Every listing is verified and certified dealers meet our strict standards.' },
  { icon: Clock, title: '24/7 Support', desc: 'Our team is always available to help with your car buying and insurance needs.' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Happy Buyer', rating: 5, text: 'Found my dream Tesla and got insured on the same day! AutoShield made it so simple.' },
  { name: 'Mike Rodriguez', role: 'Verified Buyer', rating: 5, text: 'Saved over $800/year on insurance compared to my old provider. The comparison tool is amazing.' },
  { name: 'Emily Chen', role: 'Repeat Customer', rating: 5, text: 'This is my third car purchase through AutoShield. The process gets better every time.' },
]

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2d5a8e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f97316] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/30 rounded-full px-4 py-2 text-sm text-orange-200 mb-6">
              <Shield className="h-4 w-4" />
              Buy a car, get insured — all in one place
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Car.<br />
              <span className="text-[#f97316]">Protect It Instantly.</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              AutoShield is the smarter way to buy a car. Browse thousands of listings and get matched with the perfect insurance plan — all in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars">
                <Button size="xl" variant="orange" className="gap-2">
                  <Car className="h-5 w-5" />
                  Browse Cars
                </Button>
              </Link>
              <Link href="/insurance/quote">
                <Button size="xl" variant="outline" className="gap-2 border-white text-white hover:bg-white hover:text-[#1e3a5f]">
                  <Shield className="h-5 w-5" />
                  Get Insured
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-[#1e3a5f]/10 rounded-full p-3">
                    <Icon className="h-6 w-6 text-[#1e3a5f]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#1e3a5f]">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
              <p className="text-gray-500 mt-1">Hand-picked vehicles from trusted dealers</p>
            </div>
            <Link href="/cars" className="flex items-center gap-1 text-[#1e3a5f] hover:text-[#f97316] font-medium transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Value Prop */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/30 rounded-full px-4 py-2 text-sm text-orange-200 mb-6">
                <Shield className="h-4 w-4" />
                Why insurance matters
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Don&apos;t Drive Off<br />
                <span className="text-[#f97316]">Without Coverage</span>
              </h2>
              <p className="text-white/80 text-lg mb-8">
                The moment you drive your new car off the lot, you need insurance. We&apos;ve partnered with top insurers to get you the best rates instantly.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Compare quotes from 15+ insurance providers',
                  'Save an average of $2,400 per year',
                  'Coverage starts the same day',
                  'Bundle car buying and insurance for extra savings',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#f97316] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/insurance">
                <Button variant="orange" size="lg" className="gap-2">
                  Explore Insurance Plans <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'Liability', price: '$35', desc: 'Basic state-required coverage' },
                { type: 'Comprehensive', price: '$79', desc: 'Full protection + collision' },
                { type: 'Full Coverage', price: '$120', desc: 'Complete peace of mind' },
                { type: 'Gap Insurance', price: '$15', desc: 'Protect your investment' },
              ].map((plan) => (
                <div key={plan.type} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                  <p className="text-xs text-white/60 mb-1">{plan.type}</p>
                  <p className="text-2xl font-bold text-[#f97316]">{plan.price}<span className="text-sm font-normal text-white/60">/mo</span></p>
                  <p className="text-sm text-white/70 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose AutoShield?</h2>
            <p className="text-gray-500 mt-2">Everything you need to buy and protect your car</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl border border-gray-100 hover:border-[#1e3a5f]/30 transition-colors">
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

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Join thousands of happy drivers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#f97316] to-[#ea6c10] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl text-white/90 mb-8">Join 50,000+ happy drivers who found their car and insurance on AutoShield</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cars">
              <Button size="xl" className="bg-white text-[#f97316] hover:bg-gray-100 gap-2">
                <Car className="h-5 w-5" />
                Browse Cars
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
