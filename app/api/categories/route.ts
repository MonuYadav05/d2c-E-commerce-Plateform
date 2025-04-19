import { NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET() {
  try {
    const categories = await prismadb.category.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}