'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { User, Mail, Phone, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getInitials } from '@/lib/utils'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (session?.user) {
      setFormData({ name: session.user.name ?? '', email: session.user.email ?? '', phone: '' })
    }
  }, [session])

  if (status === 'unauthenticated') redirect('/auth/login')
  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error ?? 'Failed to change password' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(session?.user?.name ?? 'U')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{session?.user?.name}</h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full px-2 py-0.5 font-medium">
              {session?.user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="pl-10" />
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPwd">Current Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="currentPwd" type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="newPwd">New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="newPwd" type="password" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPwd">Confirm New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="confirmPwd" type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} className="pl-10" />
            </div>
          </div>
          <Button onClick={handleChangePassword} disabled={saving || !passwords.current || !passwords.new} variant="outline" className="gap-2">
            <Lock className="h-4 w-4" />
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}
