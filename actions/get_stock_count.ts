import prismadb from "@/lib/prismadb";

const getStockCount = async (storeId: string) => {
  const stockCount = prismadb.product.count({
    where: {
      storeId,
      isArchived: false
    }
  });

  return stockCount;
}

export default getStockCount;