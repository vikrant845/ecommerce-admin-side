import { ColumnDef } from '@tanstack/react-table';
import CellAction from '../../components/cell_actions';

export type OrderColumn = {
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  isPaid: boolean;
  id: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: 'Products'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total'
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created On'
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={ row.original } />
  }
]