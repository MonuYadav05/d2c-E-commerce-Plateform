import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/db'

export async function GET (
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = await params.productId
    console.log(productId)
    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId
      },
      include: {
        images: true,
        category: true
      }
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
