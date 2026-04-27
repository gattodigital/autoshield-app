import { Car, InsurancePlan, InsuranceProvider, InsuranceQuote, Policy, SavedCar, User } from '@prisma/client'

export type CarWithDealer = Car & {
  dealer: Pick<User, 'id' | 'name' | 'email' | 'phone'>
}

export type InsurancePlanWithProvider = InsurancePlan & {
  provider: InsuranceProvider
}

export type InsuranceQuoteWithDetails = InsuranceQuote & {
  car: Car
  plan: InsurancePlanWithProvider
}

export type PolicyWithDetails = Policy & {
  car: Car
  plan: InsurancePlanWithProvider
}

export type SavedCarWithCar = SavedCar & {
  car: CarWithDealer
}

export type CarFilters = {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  bodyType?: string
  condition?: string
  fuelType?: string
  transmission?: string
  search?: string
}

export type QuoteFormData = {
  carId: string
  planId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  address: string
  city: string
  state: string
  zip: string
  licenseNumber: string
  yearsLicensed: number
  accidents: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}
