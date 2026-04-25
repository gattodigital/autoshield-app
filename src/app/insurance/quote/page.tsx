'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Shield, Car, ChevronRight, CheckCircle, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface CarOption {
  id: string
  make: string
  model: string
  year: number
  price: number
}

interface PlanOption {
  id: string
  name: string
  type: string
  monthlyPremium: number
  deductible: number
  coverageLimit: number
  features: string
  provider: { name: string; rating: number }
}

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { num: 1, label: 'Select Car', icon: Car },
  { num: 2, label: 'Choose Coverage', icon: Shield },
  { num: 3, label: 'Your Info', icon: User },
  { num: 4, label: 'Your Quote', icon: CheckCircle },
]

function QuoteContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const prefilledCarId = searchParams.get('carId')
  const prefilledPlanId = searchParams.get('planId')

  const [step, setStep] = useState<Step>(prefilledCarId ? 2 : 1)
  const [cars, setCars] = useState<CarOption[]>([])
  const [plans, setPlans] = useState<PlanOption[]>([])
  const [selectedCarId, setSelectedCarId] = useState(prefilledCarId ?? '')
  const [selectedPlanId, setSelectedPlanId] = useState(prefilledPlanId ?? '')
  const [loading, setLoading] = useState(false)
  const [quoteResult, setQuoteResult] = useState<{ monthlyPremium: number; planName: string; provider: string } | null>(null)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: session?.user?.email ?? '', phone: '',
    dob: '', address: '', city: '', state: '', zip: '', licenseNumber: '', yearsLicensed: '5', accidents: '0',
  })

  useEffect(() => {
    fetch('/api/cars').then((r) => r.json()).then((d) => setCars(d.cars ?? []))
    fetch('/api/insurance').then((r) => r.json()).then((d) => setPlans(d.plans ?? []))
  }, [])

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email ?? '' }))
    }
  }, [session])

  const selectedCar = cars.find((c) => c.id === selectedCarId)
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  const handleSubmitQuote = async () => {
    if (!selectedCarId || !selectedPlanId) return
    setLoading(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: selectedCarId, planId: selectedPlanId, ...formData }),
      })
      const data = await res.json()
      if (data.monthlyPremium) {
        setQuoteResult({
          monthlyPremium: data.monthlyPremium,
          planName: selectedPlan?.name ?? '',
          provider: selectedPlan?.provider.name ?? '',
        })
        setStep(4)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-3 text-[#f97316]" />
          <h1 className="text-3xl font-bold">Get Your Insurance Quote</h1>
          <p className="text-white/70 mt-2">Personalized coverage in under 2 minutes</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-8">
            {STEPS.map(({ num, label }, i) => (
              <div key={num} className="flex items-center gap-1 md:gap-2">
                <div className={`flex items-center gap-1.5 ${step === num ? 'text-[#1e3a5f]' : step > num ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === num ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white' : step > num ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                    {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300 mx-1 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Car */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Which car are you insuring?</h2>
            <p className="text-gray-500 mb-6">Select from our inventory or enter your vehicle details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedCarId === car.id ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCarId === car.id ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{car.year} {car.make} {car.model}</p>
                    <p className="text-sm text-gray-500">${car.price.toLocaleString()}</p>
                  </div>
                  {selectedCarId === car.id && <CheckCircle className="h-5 w-5 text-[#1e3a5f] ml-auto" />}
                </div>
              ))}
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2"
              disabled={!selectedCarId}
              onClick={() => setStep(2)}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Choose Coverage */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {selectedCar && (
                <div className="bg-[#1e3a5f]/10 rounded-lg px-3 py-1.5 text-sm text-[#1e3a5f] font-medium">
                  {selectedCar.year} {selectedCar.make} {selectedCar.model}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your coverage</h2>
            <p className="text-gray-500 mb-6">Select the plan that best fits your needs and budget</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {plans.map((plan) => {
                const features = JSON.parse(plan.features) as string[]
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-colors ${selectedPlanId === plan.id ? 'border-[#f97316] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.provider.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#f97316]">${plan.monthlyPremium}</p>
                        <p className="text-xs text-gray-500">/month</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                      <span>Deductible: ${plan.deductible.toLocaleString()}</span>
                      <span>Coverage: ${(plan.coverageLimit / 1000).toFixed(0)}K</span>
                    </div>
                    <ul className="space-y-1">
                      {features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {selectedPlanId === plan.id && (
                      <div className="mt-3 flex items-center gap-1 text-[#f97316] text-sm font-medium">
                        <CheckCircle className="h-4 w-4" /> Selected
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2"
              disabled={!selectedPlanId}
              onClick={() => setStep(3)}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
            <p className="text-gray-500 mb-6">We need a few details to finalize your quote</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))} placeholder="John" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))} placeholder="Smith" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="licenseNumber">Driver License #</Label>
                <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e) => setFormData((p) => ({ ...p, licenseNumber: e.target.value }))} placeholder="DL12345678" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} placeholder="123 Main St" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} placeholder="San Francisco" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select id="state" value={formData.state} onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))} className="mt-1">
                  <option value="">Select State</option>
                  {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" value={formData.zip} onChange={(e) => setFormData((p) => ({ ...p, zip: e.target.value }))} placeholder="94105" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="yearsLicensed">Years Licensed</Label>
                <Select id="yearsLicensed" value={formData.yearsLicensed} onChange={(e) => setFormData((p) => ({ ...p, yearsLicensed: e.target.value }))} className="mt-1">
                  {['1','2','3','4','5','6','7','8','9','10+'].map((y) => <option key={y} value={y}>{y} years</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="accidents">Accidents (last 3 years)</Label>
                <Select id="accidents" value={formData.accidents} onChange={(e) => setFormData((p) => ({ ...p, accidents: e.target.value }))} className="mt-1">
                  <option value="0">None</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </Select>
              </div>
            </div>
            <Button
              variant="orange"
              size="lg"
              className="w-full gap-2"
              disabled={loading || !formData.firstName || !formData.email}
              onClick={handleSubmitQuote}
            >
              {loading ? 'Processing...' : 'Get My Quote'} <Shield className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 4: Quote Result */}
        {step === 4 && quoteResult && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Quote is Ready!</h2>
            <p className="text-gray-500 mb-8">{quoteResult.provider} · {quoteResult.planName}</p>

            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] text-white rounded-2xl p-8 mb-8 max-w-sm mx-auto">
              <p className="text-white/70 text-sm mb-2">Your Monthly Premium</p>
              <p className="text-6xl font-bold text-[#f97316]">${quoteResult.monthlyPremium}</p>
              <p className="text-white/70 mt-1">per month</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/70">Annual cost: <span className="font-bold text-white">${(quoteResult.monthlyPremium * 12).toLocaleString()}</span></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Button variant="orange" size="lg" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Accept & Get Covered
                </Button>
              ) : (
                <Link href="/auth/register">
                  <Button variant="orange" size="lg" className="gap-2">
                    Create Account to Accept
                  </Button>
                </Link>
              )}
              <Link href="/insurance">
                <Button variant="outline" size="lg">
                  Compare Other Plans
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Quote valid for 30 days · No commitment required</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading quote form...</div></div>}>
      <QuoteContent />
    </Suspense>
  )
}
