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
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const wishlistItems = await prismadb.wishlistItem.findMany({
      where: {
        userId: user.id
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { productId } = await req.json();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existingItem = await prismadb.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existingItem) {
      return new NextResponse("Item already in wishlist", { status: 400 });
    }

    const wishlistItem = await prismadb.wishlistItem.create({
      data: {
        userId: user.id,
        productId
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}