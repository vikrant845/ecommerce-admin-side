"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data_table";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "../[orderId]/components/columns";
import { Separator } from "@/components/ui/separator";

interface OrderClientProps {
  data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Orders(${ data.length })` }
          description="Manage orders for your store"
        />
        <Button onClick={ () => router.push(`/${ params.storeId }/orders/new`) }>
            <Plus className="mr-2 h-4 w-4" />
            Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={ columns } data={ data } searchKey='label' />
    </>
  );
}

export default OrderClient;