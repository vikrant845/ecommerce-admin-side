"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/alert_modal";
import { ColorColumn } from "../[colorId]/components/columns";

interface CellActionProps {
  data: ColorColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  
  const onCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Id Copied To Clipboard');
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios({
        method: 'DELETE',
        url: `/api/store/${ params.storeId }/colors/${ data.id }`
      });
      router.refresh();
      router.push('/');
      toast.success('Color deleted');
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Make sure you deleted all the categories in this billboard.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  
  return (
    <>
      <AlertModal
        loading={ loading }
        onClose={ () => setOpen(false) }
        isOpen={ open }
        onConfirm={ onDelete }
      />
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onCopy(data.id)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default CellAction;