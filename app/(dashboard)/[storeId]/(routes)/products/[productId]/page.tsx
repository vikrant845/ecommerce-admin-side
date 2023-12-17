import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product_form";

const ProductPage = async ({ params }: { params: { productId: string, storeId: string } }) => {
  const product = await prismadb.product.findFirst({
    where: {
      [params.productId === 'new' ? 'name' : 'id']: params.productId
    },
    include: {
      images: true
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={ product }
          colors={ colors }
          sizes={ sizes }
          categories={ categories }
        />
      </div>
    </div>
  );
}

export default ProductPage;