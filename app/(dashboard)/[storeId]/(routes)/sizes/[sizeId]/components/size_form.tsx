"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Size, Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert_modal';
import ApiAlert from '@/components/ui/api_alert';
import { useOrigin } from '@/hooks/use_origin';
import ImageUpload from '@/components/ui/image_upload';

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  value: z.string({ required_error: 'Value is required' })
});

type SizeFormType = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const title = initialData ? 'Edit Size' : 'Create Size';
  const description = initialData ? 'Edit a size.' : 'Add a new size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SizeFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData!
  });

  const onSubmit = async (values: SizeFormType) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios({
          method: 'PATCH',
          url: `/api/store/${ params.storeId }/sizes/${ params.sizeId }`,
          data: values
        });
      } else {
        await axios({
          method: 'POST',
          url: `/api/store/${ params.storeId }/sizes`,
          data: values
        });
      }
      router.refresh();
      toast.success(toastMessage);
    } catch(err) {
      toast.error('An error occurred');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios({
        method: 'DELETE',
        url: `/api/${ params.storeId }/sizes/${ params.billboardId }`
      });
      router.refresh();
      router.push('/');
      toast.success('Size Deleted');
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
    <AlertModal
      loading={ isLoading }
      isOpen={ isOpen }
      onClose={ () => setIsOpen(false) }
      onConfirm={ onDelete }
    />
      <div className="flex items-center justify-between">
        <Heading title={ title } description={ description } />
        { initialData && (
          <Button
            disabled={ isLoading }
            variant="destructive"
            size="sm"
            onClick={ () => setIsOpen(true) }
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) }
      </div>
      <Separator />
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name='name'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Size Name' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='value'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Size Value' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
          </div>
          <Button type='submit' disabled={ isLoading } className="ml-auto">{ action }</Button>
        </form>
      </Form>
    </>
  );
}

export default SizeForm;