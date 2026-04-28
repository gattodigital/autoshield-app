import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const isVercelSqliteDemo = process.env.VERCEL === '1' && (process.env.DATABASE_URL ?? '').startsWith('file:')

export async function POST(request: Request) {
  try {
    if (isVercelSqliteDemo) {
      return NextResponse.json(
        { error: 'Registration is disabled in the demo deployment. Use the demo credentials on the sign-in page.' },
        { status: 503 }
      )
    }

    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, password: hashedPassword },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
