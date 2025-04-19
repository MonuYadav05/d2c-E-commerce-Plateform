import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const featured = searchParams.get("featured");
    const search = searchParams.get("q") || undefined;
    
    const products = await prismadb.product.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(featured === "true" ? { featured: true } : {}),
        ...(search ? { 
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        images: true,
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}