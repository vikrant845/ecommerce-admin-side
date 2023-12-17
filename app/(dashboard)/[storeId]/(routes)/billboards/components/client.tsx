"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data_table";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "../[billboardId]/components/columns";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ui/api_list";

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Billboards(${ data.length })` }
          description="Manage billboards for your store"
        />
        <Button onClick={ () => router.push(`/${ params.storeId }/billboards/new`) }>
            <Plus className="mr-2 h-4 w-4" />
            Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={ columns } data={ data } searchKey='label' />
      <Heading title="API" description="API Calls for Billboards" />
      <Separator />
      <ApiList
        entityIdName="billboardId"
        entityName="billboards"
      />
    </>
  );
}

export default BillboardClient;