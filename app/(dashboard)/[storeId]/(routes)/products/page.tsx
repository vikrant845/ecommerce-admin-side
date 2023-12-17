import { formatter } from "@/lib/utils";
import prismadb from "@/lib/prismadb";
import moment from 'moment';
import { ProductColumn } from "./[productId]/components/columns";
import ProductClient from "./components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map(product => ({
    name: product.name,
    createdAt: moment(product.createdAt).format('MMMM Do YYYY'),
    id: product.id,
    isFeatured: product.isFeatured ? 'Yes' : 'No',
    isArchived: product.isArchived ? 'Yes' : 'No',
    price: formatter.format(product.price),
    category: product.category.name,
    size: product.size.name,
    color: product.color.name
  }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={ formattedProducts } />
      </div>
    </div>
  );
}

export default ProductsPage;