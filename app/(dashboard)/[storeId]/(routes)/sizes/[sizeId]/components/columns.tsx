import { ColumnDef } from '@tanstack/react-table';
import CellAction from '../../components/cell_actions';

export type SizeColumn = {
  name: string;
  value: string;
  id: string;
  createdAt: string;
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value'
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