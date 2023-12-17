import prismadb from "@/lib/prismadb";

export default async function DashboardPage({ params }: { params: { storeId: string } }) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  });
  
  return (
    <div>{ params.storeId }</div>
  );
}