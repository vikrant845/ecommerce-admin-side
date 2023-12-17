import { BillboardColumn } from "./[billboardId]/components/columns";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import moment from 'moment';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({ label: billboard.label, createdAt: moment(billboard.createdAt).format('MMMM Do YYYY'), id: billboard.id }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={ formattedBillboards } />
      </div>
    </div>
  );
}

export default BillboardsPage;