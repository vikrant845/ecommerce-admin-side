"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Store } from "@prisma/client";
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

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string({ required_error: 'Name is required' }),
  imageUrl: z.string()
});

type BillboardFormType = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit a billboard.' : 'Add a new billboard';
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<BillboardFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData!
  });

  const onSubmit = async (values: BillboardFormType) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios({
          method: 'PATCH',
          url: `/api/store/${ params.storeId }/billboards/${ params.billboardId }`,
          data: values
        });
      } else {
        console.log('In else');
        await axios({
          method: 'POST',
          url: `/api/store/${ params.storeId }/billboards`,
          data: values
        });
      }
      router.refresh();
      router.push(`/${ params.storeId }/billboards`);
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
        url: `/api/${ params.storeId }/billboards/${ params.billboardId }`
      });
      router.refresh();
      toast.success('Store Deleted');
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
          <FormField
            control={ form.control }
            name='imageUrl'
            render={ ({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={ field.value ? [ field.value ] : [] }
                    disabled={ isLoading }
                    onChange={ (url) => field.onChange(url) }
                    onRemove={ () => field.onChange('') }
                  />
                </FormControl>
              </FormItem>
            ) }
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name='label'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Billboard Label' { ...field } />
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

export default BillboardForm;