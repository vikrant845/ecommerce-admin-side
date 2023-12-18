import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  try {
    if (!params.colorId) return new NextResponse('Catehory Id required', { status: 400 });

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    });

    return NextResponse.json(color);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!name) return new NextResponse('Name required', { status: 400 });
    if (!value) return new NextResponse('Billboard ID required', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.colorId) return new NextResponse('Category Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(color);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  try {

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId
      }
    });
    return NextResponse.json(color);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}