"use client";

import * as z from 'zod';

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
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

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
});

type SettingsFormType = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const form = useForm<SettingsFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (values: SettingsFormType) => {
    try {
      setIsLoading(true);
      await axios({
        method: 'PATCH',
        url: `/api/store/${ params.storeId }`,
        data: values
      });
      router.refresh();
      toast.success('Store Updated');
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
        url: `/api/store/${ params.storeId }`
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
        <Heading title="Store settings" description="Manage store preferences" />
        <Button
          disabled={ isLoading }
          variant="destructive"
          size="sm"
          onClick={ () => setIsOpen(true) }
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                    <Input disabled={ isLoading } placeholder='Store Name' { ...field } />
                  </FormControl>
                </FormItem>
              ) }
            />
          </div>
          <Button type='submit' disabled={ isLoading } className="ml-auto">Save Changes</Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={ `${ origin }/api/${ params.storeId }` }
        variant='public'
      />
    </>
  );
}

export default SettingsForm;