import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('en-US').format(mileage) + ' mi'
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generatePolicyNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900000) + 100000
  return `AS-${year}-${random}`
}

export function calculateInsuranceScore(carPrice: number, carYear: number): number {
  const age = new Date().getFullYear() - carYear
  const priceScore = Math.min(carPrice / 100000, 1) * 50
  const ageScore = Math.max(0, (10 - age) / 10) * 50
  return Math.round(priceScore + ageScore)
}
