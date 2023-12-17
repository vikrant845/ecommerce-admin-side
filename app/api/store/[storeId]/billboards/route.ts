import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {
    const { userId } = auth();
  
    const body = await req.json();
    const { label, imageUrl } = body;
    const { storeId } = params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!label) return new NextResponse('Label Not Provided', { status: 400 });

    if (!imageUrl) return new NextResponse('Image URL Not Provided', { status: 400 });

    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboard);

  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { storeId } = params;
    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });
    
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
  
}