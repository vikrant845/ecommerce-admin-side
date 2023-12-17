import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name not provided", { status: 400 });
    if (!params.storeId) return new NextResponse("StoreID not provided", { status: 400 });

    const stores = await prismadb.store.updateMany({
      where: {
        userId,
        id: params.storeId
      },
      data: {
        name
      }
    });

    return NextResponse.json(stores);
  } catch (err) {
    console.log('PATCH_STORE', err);
    return new NextResponse('An error occurred', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId) return new NextResponse('Store Id Not Provided', { status: 400 });

    const store = await prismadb.store.deleteMany({
      where: {
        userId,
        id: params.storeId
      }
    });

    return NextResponse.json(store);
  } catch (err) {
    console.log('STORE_DELETE', err);
    return new NextResponse('An error occurred', { status: 500 });
  }
}