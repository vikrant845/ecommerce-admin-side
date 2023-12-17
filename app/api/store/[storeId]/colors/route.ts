import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {
    const { userId } = auth();
  
    const body = await req.json();
    const { name, value } = body;
    const { storeId } = params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse('Name Not Provided', { status: 400 });

    if (!value) return new NextResponse('Category ID Not Provided', { status: 400 });

    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    });

    return NextResponse.json(color);

  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { storeId } = params;
    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });
    
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(colors);
  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
  
}