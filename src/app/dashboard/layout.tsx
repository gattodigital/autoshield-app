'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Car, Shield, User, LogOut, ChevronRight, Store } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/cars', label: 'Saved Cars', icon: Car },
  { href: '/dashboard/insurance', label: 'My Insurance', icon: Shield },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" />
      </div>
    )
  }

  const isDealer = session?.user?.role === 'DEALER'

  const items = isDealer
    ? [...navItems, { href: '/dashboard/listings', label: 'My Listings', icon: Store }]
    : navItems

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* User info */}
              <div className="bg-[#1e3a5f] p-6 text-white">
                <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center text-xl font-bold mb-3">
                  {session?.user?.name?.[0] ?? 'U'}
                </div>
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="text-white/70 text-sm">{session?.user?.email}</p>
                {isDealer && (
                  <span className="inline-block mt-2 text-xs bg-[#f97316] rounded-full px-2 py-0.5">Dealer</span>
                )}
              </div>

              {/* Nav */}
              <nav className="p-3">
                {items.map(({ href, label, icon: Icon, exact }) => {
                  const isActive = exact ? pathname === href : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${isActive ? 'bg-[#1e3a5f] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 ${isActive ? 'text-white/50' : 'text-gray-400'}`} />
                    </Link>
                  )
                })}

                <hr className="my-3 border-gray-100" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
