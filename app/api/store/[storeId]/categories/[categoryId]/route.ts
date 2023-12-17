import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {
    if (!params.categoryId) return new NextResponse('Catehory Id required', { status: 400 });

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      },
      include: {
        billboard: true
      }
    });

    return NextResponse.json(category);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!name) return new NextResponse('Name required', { status: 400 });
    if (!billboardId) return new NextResponse('Billboard ID required', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.categoryId) return new NextResponse('Category Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId
      },
      data: {
        name,
        billboardId
      }
    });

    return NextResponse.json(category);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  try {

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId
      }
    });
    return NextResponse.json({ message: 'Billboard Deleted' });
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}