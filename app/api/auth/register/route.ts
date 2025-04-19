import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prismadb from '@/lib/db'

export async function POST (req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    console.log(name, email, password)
    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prismadb.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse('Email already registered', { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prismadb.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('[REGISTER]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
