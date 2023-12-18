import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, orderId: string } }) {
  try {
    if (!params.orderId) return new NextResponse('Order Id required', { status: 400 });

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId
      }
    });

    return NextResponse.json(order);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, orderId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!label) return new NextResponse('Label required', { status: 400 });
    if (!imageUrl) return new NextResponse('Image Url required', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.orderId) return new NextResponse('Billboard Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.orderId
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

export async function DELETE(req: Request, { params }: { params: { storeId: string, orderId: string } }) {
  try {

    const order = await prismadb.order.deleteMany({
      where: {
        id: params.orderId
      }
    });
    return NextResponse.json({ message: 'Order Deleted' });
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}