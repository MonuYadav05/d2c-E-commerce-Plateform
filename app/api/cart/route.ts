import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { cart: { include: { items: { include: { product: { include: { images: true } } } } } } }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!user.cart) {
      const cart = await prismadb.cart.create({
        data: {
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
          }
        }
      });

      return NextResponse.json(cart);
    }

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { productId, quantity } = await req.json();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId || !quantity) {
      return new NextResponse("Product ID and quantity are required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let cart = user.cart;

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prismadb.cart.create({
        data: {
          userId: user.id
        }
      });
    }

    // Check if product already exists in cart
    const existingCartItem = await prismadb.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existingCartItem) {
      // Update existing cart item
      const updatedCartItem = await prismadb.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      });

      return NextResponse.json(updatedCartItem);
    } else {
      // Create new cart item
      const cartItem = await prismadb.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      });

      return NextResponse.json(cartItem);
    }
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}