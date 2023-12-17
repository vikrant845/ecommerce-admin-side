import { SizeColumn } from "./[sizeId]/components/columns";
import SizeClient from "./components/client";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import moment from 'moment';

const Sizes = async ({ params }: { params: { storeId: string } }) => {

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map(size => ({ name: size.name, createdAt: moment(size.createdAt).format('MMMM Do YYYY'), id: size.id, value: size.value }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={ formattedSizes } />
      </div>
    </div>
  );
}

export default Sizes;