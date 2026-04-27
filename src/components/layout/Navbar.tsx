'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Shield, Car, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-[#f97316] rounded-lg p-1.5">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span>Auto<span className="text-[#f97316]">Shield</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cars" className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors text-sm font-medium">
              <Car className="h-4 w-4" />
              Browse Cars
            </Link>
            <Link href="/insurance" className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors text-sm font-medium">
              <Shield className="h-4 w-4" />
              Insurance
            </Link>
            <Link href="/insurance/quote" className="text-sm font-medium hover:text-[#f97316] transition-colors">
              Get a Quote
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-sm font-bold">
                    {getInitials(session.user.name || 'U')}
                  </div>
                  <span className="text-sm font-medium">{session.user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="orange" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#152d4a] border-t border-white/10 px-4 py-4 space-y-2">
          <Link href="/cars" className="flex items-center gap-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>
            <Car className="h-4 w-4" /> Browse Cars
          </Link>
          <Link href="/insurance" className="flex items-center gap-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>
            <Shield className="h-4 w-4" /> Insurance
          </Link>
          <Link href="/insurance/quote" className="flex items-center gap-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>
            Get a Quote
          </Link>
          <hr className="border-white/10 my-2" />
          {session ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 py-2 text-sm text-red-400 w-full">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/register" className="block py-2 text-sm text-[#f97316]" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
