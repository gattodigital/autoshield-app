import * as React from 'react'
import { cn } from '@/lib/utils'

const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </select>
)
Select.displayName = 'Select'

export { Select }
