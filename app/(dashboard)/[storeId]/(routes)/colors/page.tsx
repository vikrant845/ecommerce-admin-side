import ColorClient from "./components/client";
import prismadb from "@/lib/prismadb";
import moment from 'moment';
import { ColorColumn } from "./[colorId]/components/columns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: ColorColumn[] = colors.map(color => ({ name: color.name, createdAt: moment(color.createdAt).format('MMMM Do YYYY'), id: color.id, value: color.value }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={ formattedSizes } />
      </div>
    </div>
  );
}

export default ColorsPage;