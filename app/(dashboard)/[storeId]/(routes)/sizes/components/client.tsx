"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data_table";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ui/api_list";
import { SizeColumn, columns } from "../[sizeId]/components/columns";

interface SizeClientProps {
  data: SizeColumn[]
}

const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Sizes(${ data.length })` }
          description="Manage sizes for your store"
        />
        <Button onClick={ () => router.push(`/${ params.storeId }/sizes/new`) }>
            <Plus className="mr-2 h-4 w-4" />
            Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={ columns }
        data={ data }
        searchKey='name'
      />
      <Heading
        title="API"
        description="API Calls for Sizes"
      />
      <Separator />
      <ApiList
        entityIdName="sizeId"
        entityName="sizes"
      />
    </>
  );
}

export default SizeClient;