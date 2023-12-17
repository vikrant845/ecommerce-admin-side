import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {
    const { userId } = auth();
  
    const body = await req.json();
    const { name, billboardId } = body;
    const { storeId } = params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse('Name Not Provided', { status: 400 });

    if (!billboardId) return new NextResponse('Category ID Not Provided', { status: 400 });

    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    });

    return NextResponse.json(category);

  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { storeId } = params;
    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });
    
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
  
}