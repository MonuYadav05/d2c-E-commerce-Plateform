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

    const orders = await prismadb.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('[ORDERS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST (req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { addressId, paymentMethod, promoCode } = await req.json()

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!addressId || !paymentMethod) {
      return new NextResponse('Address ID and payment method are required', {
        status: 400
      })
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (!user.cart || user.cart.items.length === 0) {
      return new NextResponse('Cart is empty', { status: 400 })
    }

    // Calculate order total
    let subtotal = 0
    const tax = 0.05 // 5% tax

    // Calculate promo discount if applicable
    let promoDiscount = 0
    if (promoCode === 'WELCOME10') {
      promoDiscount = 0.1 // 10% discount for WELCOME10 code
    }

    // Calculate subtotal from cart items
    user.cart.items.forEach(item => {
      subtotal += item.product.price * item.quantity
    })

    // Apply promo discount
    const discountAmount = subtotal * promoDiscount
    const deliveryFee = subtotal >= 499 ? 0 : 49

    // Calculate tax
    const taxAmount = (subtotal - discountAmount) * tax

    // Calculate total amount
    const totalAmount = subtotal - discountAmount + taxAmount + deliveryFee

    // Create order with items from cart
    const order = await prismadb.order.create({
      data: {
        userId: user.id,
        addressId,
        totalAmount,
        promoCode: promoDiscount > 0 ? promoCode : null,
        promoDiscount: discountAmount > 0 ? discountAmount : null,
        deliveryFee,
        tax: taxAmount,
        paymentMethod,
        items: {
          create: user.cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        address: true
      }
    })

    // Clear the cart after creating the order
    await prismadb.cartItem.deleteMany({
      where: {
        cartId: user.cart.id
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[ORDERS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
