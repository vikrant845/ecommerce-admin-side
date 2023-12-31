import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
  try {
    if (!params.sizeId) return new NextResponse('Catehory Id required', { status: 400 });

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId
      }
    });

    return NextResponse.json(size);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!name) return new NextResponse('Name required', { status: 400 });
    if (!value) return new NextResponse('Billboard ID required', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.sizeId) return new NextResponse('Category Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(size);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
  try {

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId
      }
    });
    return NextResponse.json(size);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}