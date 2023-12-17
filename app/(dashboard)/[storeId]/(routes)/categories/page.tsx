import { CategoryColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";
import moment from 'moment';
import CategoryClient from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map(category => ({ name: category.name, createdAt: moment(category.createdAt).format('MMMM Do YYYY'), id: category.id, billboardLabel: category.billboard.label }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={ formattedCategories } />
      </div>
    </div>
  );
}

export default CategoriesPage;