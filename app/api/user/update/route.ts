import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { hash, compare } from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/db'

export async function PUT (req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, currentPassword, newPassword } = await req.json()

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (currentPassword && newPassword) {
      const isValid = await compare(currentPassword, user.hashedPassword)

      if (!isValid) {
        return new NextResponse('Current password is incorrect', {
          status: 400
        })
      }

      const hashedPassword = await hash(newPassword, 10)

      await prismadb.user.update({
        where: { id: user.id },
        data: {
          name,
          hashedPassword
        }
      })
    } else {
      await prismadb.user.update({
        where: { id: user.id },
        data: { name }
      })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('[USER_UPDATE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
