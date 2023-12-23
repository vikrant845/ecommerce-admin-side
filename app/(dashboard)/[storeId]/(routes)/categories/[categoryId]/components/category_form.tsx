"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Category, Store } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  billboardId: z.string({ required_error: 'Billboard ID is required' })
});

type CategoryFormType = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData, billboards }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData ? 'Edit a category.' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData!
  });

  const onSubmit = async (values: CategoryFormType) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios({
          method: 'PATCH',
          url: `/api/store/${ params.storeId }/categories/${ params.categoryId }`,
          data: values
        });
      } else {
        await axios({
          method: 'POST',
          url: `/api/store/${ params.storeId }/categories`,
          data: values
        });
      }
      router.refresh();
      router.push(`/${ params.storeId }/categories`);
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
        url: `/api/${ params.storeId }/categories/${ params.categoryId }`
      });
      router.refresh();
      toast.success('Category Deleted');
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Category Name' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='billboardId'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    onValueChange={ field.onChange }
                    disabled={ isLoading }
                    defaultValue={ field.value }
                    value={ field.value }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={ field.value }
                          placeholder='Select a billboard'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      { billboards.map(billboard => (
                        <SelectItem
                          key={ billboard.id }
                          value={ billboard.id }
                        >
                          { billboard.label }
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
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