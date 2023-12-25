import getGraphRevenue from "@/actions/get_graph_revenue";
import getSalesCount from "@/actions/get_sales_count";
import getStockCount from "@/actions/get_stock_count";
import getTotalRevenue from "@/actions/get_total_revenue";
import Overview from "@/components/overview";
import ProjectInfoModal from "@/components/project_info_modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

export default async function DashboardPage({ params }: { params: { storeId: string } }) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  const totalRevenue = await getTotalRevenue(store?.id!);
  const salesCount = await getSalesCount(store?.id!);
  const stockCount = await getStockCount(store?.id!);
  const graphData = await getGraphRevenue(store?.id!);
  
  return (
    <div className="flex-col">
      <ProjectInfoModal />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={ graphData } />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}