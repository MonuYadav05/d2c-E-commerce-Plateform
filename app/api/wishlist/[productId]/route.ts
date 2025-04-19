import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await prismadb.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.productId
        }
      }
    });

    return NextResponse.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}