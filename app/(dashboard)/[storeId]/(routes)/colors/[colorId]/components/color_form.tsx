"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Color } from "@prisma/client";
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
import { useOrigin } from '@/hooks/use_origin';

interface ColorFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  value: z.string({ required_error: 'Value is required' }).regex(/^#/, { message: 'Colour should be a valid hex string' })
});

type ColorFormType = z.infer<typeof formSchema>;

const ColorForm = ({ initialData }: ColorFormProps) => {
  const params = useParams();
  const router = useRouter();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const title = initialData ? 'Edit Color' : 'Create Color';
  const description = initialData ? 'Edit a color.' : 'Add a new color';
  const toastMessage = initialData ? 'Color updated.' : 'Color created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData!
  });

  const onSubmit = async (values: ColorFormType) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios({
          method: 'PATCH',
          url: `/api/store/${ params.storeId }/colors/${ params.colorId }`,
          data: values
        });
      } else {
        await axios({
          method: 'POST',
          url: `/api/store/${ params.storeId }/colors`,
          data: values
        });
      }
      router.refresh();
      router.push(`/${ params.storeId }/colors`);
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
      toast.success('Color Deleted');
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
                  <FormLabel>Color Name</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Color Name' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='value'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Color HexCode</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={ isLoading } placeholder='Color Value' { ...field } />
                      <div 
                        className="border p-4 rounded-full" 
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;