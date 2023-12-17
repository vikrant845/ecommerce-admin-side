"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Category, Color, Product, Size } from "@prisma/client";
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
import ImageUpload from '@/components/ui/image_upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  initialData: Product | null;
  colors: Color[];
  sizes: Size[];
  categories: Category[];
}

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  isFeatured: z.string(),
  isArchived: z.string(),
  categoryId: z.string(),
  colorId: z.string(),
  sizeId: z.string(),
  price: z.coerce.number(),
  images: z.object({ url: z.string() }).array(),
});

type ProductFormType = z.infer<typeof formSchema>;

const ProductForm = ({ initialData, colors, sizes, categories }: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const title = initialData ? 'Edit Product' : 'Create Product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ProductFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData.price)),
      isFeatured: initialData.isFeatured ? 'Yes' : 'No',
      isArchived: initialData.isArchived ? 'Yes' : 'No',
    } : {
      name: '',
      images: [],
      isArchived: 'No',
      isFeatured: 'No',
      categoryId: '',
      sizeId: '',
      colorId: '',
      price: 0,
    }
  });

  const onSubmit = async (values: ProductFormType) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios({
          method: 'PATCH',
          url: `/api/store/${ params.storeId }/products/${ params.productId }`,
          data: { ...values, isFeatured: values.isFeatured === 'Yes' ? true : false, isArchived: values.isArchived === 'Yes' ? true : false }
        });
      } else {
        console.log({ ...values, isFeatured: values.isFeatured === 'Yes' ? true : false, isArchived: values.isArchived === 'Yes' ? true : false });
        await axios({
          method: 'POST',
          url: `/api/store/${ params.storeId }/products`,
          data: { ...values, isFeatured: values.isFeatured === 'Yes' ? true : false, isArchived: values.isArchived === 'Yes' ? true : false }
        });
      }
      router.refresh();
      router.push(`/${ params.storeId }/products`);
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
        url: `/api/${ params.storeId }/products/${ params.productId }`
      });
      router.refresh();
      router.push('/');
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
            name='images'
            render={ ({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={ field.value.map(image => image.url) }
                    disabled={ isLoading }
                    onChange={ (url) => field.onChange([ ...field.value, { url } ]) }
                    onRemove={ (url) => field.onChange([ ...field.value.filter(current => current.url !== url) ]) }
                  />
                </FormControl>
              </FormItem>
            ) }
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name='name'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Product Name' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='price'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={ isLoading } placeholder='Product Price' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='categoryId'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder='Select a Category'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      { categories.map(category => (
                        <SelectItem
                          key={ category.id }
                          value={ category.id }
                        >
                          { category.name }
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='colorId'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder='Select a Color'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      { colors.map(color => (
                        <SelectItem
                          key={ color.id }
                          value={ color.id }
                        >
                          { color.name }
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='sizeId'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                          placeholder='Select a Size'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      { sizes.map(size => (
                        <SelectItem
                          key={ size.id }
                          value={ size.id }
                        >
                          { size.name }
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='isFeatured'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Featured</FormLabel>
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
                          placeholder='Select Yes Or No'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        key='yes_f'
                        value='Yes'
                      >
                        Yes
                      </SelectItem>
                      <SelectItem
                        key='no_f'
                        value='No'
                      >
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='isArchived'
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Archived</FormLabel>
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
                          placeholder='Select Yes Or No'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        key='yes_a'
                        value='Yes'
                      >
                        Yes
                      </SelectItem>
                      <SelectItem
                        key='no_a'
                        value='No'
                      >
                        No
                      </SelectItem>
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

export default ProductForm;