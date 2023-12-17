import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {
    if (!params.billboardId) return new NextResponse('Billboard Id required', { status: 400 });

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId
      }
    });

    return NextResponse.json(billboard);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!label) return new NextResponse('Label required', { status: 400 });
    if (!imageUrl) return new NextResponse('Image Url required', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.billboardId) return new NextResponse('Billboard Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId
      },
      data: {
        label,
        imageUrl
      }
    });

    return NextResponse.json(billboard);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId
      }
    });
    return NextResponse.json({ message: 'Billboard Deleted' });
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}