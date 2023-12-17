import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/size_form";
import SizeForm from "./components/size_form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await prismadb.size.findFirst({
    where: {
      [params.sizeId === 'new' ? 'name' : 'id']: params.sizeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={ size } />
      </div>
    </div>
  );
}

export default SizePage;