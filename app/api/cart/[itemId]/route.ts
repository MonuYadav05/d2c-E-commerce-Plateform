import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { quantity } = await req.json();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.itemId) {
      return new NextResponse("Cart item ID is required", { status: 400 });
    }

    if (quantity === undefined) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user?.cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Ensure the cart item belongs to the user's cart
    const cartItem = await prismadb.cartItem.findFirst({
      where: {
        id: params.itemId,
        cartId: user.cart.id
      }
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    if (quantity <= 0) {
      // Delete the item if quantity is 0 or negative
      await prismadb.cartItem.delete({
        where: {
          id: params.itemId
        }
      });
      
      return NextResponse.json({ message: "Item removed from cart" });
    } else {
      // Update the quantity
      const updatedCartItem = await prismadb.cartItem.update({
        where: {
          id: params.itemId
        },
        data: {
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

      return NextResponse.json(updatedCartItem);
    }
  } catch (error) {
    console.error("[CART_ITEM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.itemId) {
      return new NextResponse("Cart item ID is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user?.cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Ensure the cart item belongs to the user's cart
    const cartItem = await prismadb.cartItem.findFirst({
      where: {
        id: params.itemId,
        cartId: user.cart.id
      }
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    // Delete the cart item
    await prismadb.cartItem.delete({
      where: {
        id: params.itemId
      }
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("[CART_ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}