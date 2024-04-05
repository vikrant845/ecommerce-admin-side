import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    if (!params.productId) return new NextResponse('Product Id required', { status: 400 });

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true
      }
    });

    return NextResponse.json(product);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, isFeatured, isArchived, colorId, sizeId, categoryId, images } = body;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!name) return new NextResponse('Name Not Provided', { status: 400 });

    if (!images || !images.length) return new NextResponse('Images Not Provided', { status: 400 });

    if (!price) return new NextResponse('Price Not Provided', { status: 400 });

    if (isFeatured === null || isFeatured === undefined) return new NextResponse('Featured Not Provided', { status: 400 });

    if (isArchived === null || isArchived === undefined) return new NextResponse('Archived Not Provided', { status: 400 });

    if (!categoryId) return new NextResponse('Category ID Not Provided', { status: 400 });

    if (!colorId) return new NextResponse('Color ID Not Provided', { status: 400 });

    if (!sizeId) return new NextResponse('Size ID Not Provided', { status: 400 });
    if (!params.storeId) return new NextResponse('Store Id required', { status: 400 });
    if (!params.productId) return new NextResponse('Product Id required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        colorId,
        sizeId,
        categoryId,
        images: {
          deleteMany: {}
        },
        storeId: params.storeId
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [ ...images.map((image: { url: string }) => image) ]
          }
        },
      }
    });

    return NextResponse.json(product);
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId
      }
    });
    return NextResponse.json({ message: 'Product Deleted' });
  } catch(err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}