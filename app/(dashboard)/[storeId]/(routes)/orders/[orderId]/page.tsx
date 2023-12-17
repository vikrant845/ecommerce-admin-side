import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/order_form";

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
  const billboard = await prismadb.billboard.findFirst({
    where: {
      [params.billboardId === 'new' ? 'label' : 'id']: params.billboardId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={ billboard } />
      </div>
    </div>
  );
}

export default BillboardPage;