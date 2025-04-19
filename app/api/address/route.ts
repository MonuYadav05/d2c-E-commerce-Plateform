import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prismadb from '@/lib/db'

export async function GET () {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const addresses = await prismadb.address.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        isDefault: 'desc'
      }
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('[ADDRESSES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST (req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      phoneNumber,
      isDefault
    } = await req.json()

    console.log(
      fullName,
      addressLine1,
      city,
      state,
      postalCode,
      phoneNumber,
      isDefault
    )

    if (
      !fullName ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !phoneNumber
    ) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prismadb.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Check if this is the first address, make it default if so
    const addressCount = await prismadb.address.count({
      where: {
        userId: user.id
      }
    })

    const address = await prismadb.address.create({
      data: {
        userId: user.id,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        phoneNumber,
        isDefault: isDefault || addressCount === 0 // Make default if explicitly set or if it's the first address
      }
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error('[ADDRESSES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
