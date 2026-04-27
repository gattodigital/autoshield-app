import Link from 'next/link'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="bg-[#f97316] rounded-lg p-1.5">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span>Auto<span className="text-[#f97316]">Shield</span></span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted platform for buying cars and protecting your investment with the right insurance.
            </p>
            <div className="flex gap-3 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <a key={i} href="#" className="bg-white/10 hover:bg-[#f97316] rounded-lg p-2 transition-colors">
                  <div className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                { href: '/cars', label: 'Browse Cars' },
                { href: '/insurance', label: 'Insurance Plans' },
                { href: '/insurance/quote', label: 'Get a Quote' },
                { href: '/auth/register', label: 'Create Account' },
                { href: '/auth/login', label: 'Sign In' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#f97316] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-semibold mb-4">Insurance Types</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                'Liability Coverage',
                'Comprehensive Coverage',
                'Collision Coverage',
                'Full Coverage',
                'Gap Insurance',
                'Roadside Assistance',
              ].map((item) => (
                <li key={item}>
                  <Link href="/insurance" className="hover:text-[#f97316] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#f97316]" />
                <span>1-800-AUTOSHIELD</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#f97316]" />
                <span>support@autoshield.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#f97316] mt-0.5" />
                <span>123 Insurance Blvd<br />San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 mt-8 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© 2024 AutoShield. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
