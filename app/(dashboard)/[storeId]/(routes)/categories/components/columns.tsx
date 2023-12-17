import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell_actions';

export type CategoryColumn = {
  name: string;
  id: string;
  billboardLabel: string;
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
    cell: ({ row }) => row.original.billboardLabel
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