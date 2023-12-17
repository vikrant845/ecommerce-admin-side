"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data_table";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "../[productId]/components/columns";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ui/api_list";

interface ProductClientProps {
  data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Products(${ data.length })` }
          description="Manage products for your store"
        />
        <Button onClick={ () => router.push(`/${ params.storeId }/products/new`) }>
            <Plus className="mr-2 h-4 w-4" />
            Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={ columns } data={ data } searchKey='name' />
      <Heading title="API" description="API Calls for Products" />
      <Separator />
      <ApiList
        entityIdName="productId"
        entityName="products"
      />
    </>
  );
}

export default ProductClient;