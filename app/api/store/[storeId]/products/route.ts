import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    const { userId } = auth();
  
    const body = await req.json();
    const { name, price, isFeatured, isArchived, colorId, sizeId, categoryId, images } = body;
    const { storeId } = params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse('Name Not Provided', { status: 400 });

    if (!images || !images.length) return new NextResponse('Images Not Provided', { status: 400 });

    if (!price) return new NextResponse('Price Not Provided', { status: 400 });

    if (!isFeatured === undefined) return new NextResponse('Featured Not Provided', { status: 400 });

    if (!isArchived === undefined) return new NextResponse('Archived Not Provided', { status: 400 });

    if (!categoryId) return new NextResponse('Category ID Not Provided', { status: 400 });

    if (!colorId) return new NextResponse('Color ID Not Provided', { status: 400 });

    if (!sizeId) return new NextResponse('Size ID Not Provided', { status: 400 });

    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse('Store not found', { status: 404 });

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        colorId,
        sizeId,
        categoryId,
        images: {
          createMany: {
            data: [ ...images.map((image: { url: string }) => image) ]
          }
        },
        storeId: params.storeId
      }
    });

    return NextResponse.json(product);

  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { storeId } = params;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const isFeatured = searchParams.get('isFeatured') || undefined;
    
    if (!storeId) return new NextResponse('Store ID Not Provided', { status: 400 });
    
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined
      },
      include: {
        size: true,
        category: true,
        color: true,
        images: true
      }
    });

    return NextResponse.json(products);
  } catch (err) {
    console.log(err);
    return new NextResponse("An error occurred", { status: 500 });
  }
  
}