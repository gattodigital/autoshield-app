import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, phone } = await request.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || undefined, phone: phone || undefined },
  })

  return NextResponse.json({ id: user.id, name: user.name, email: user.email })
}
