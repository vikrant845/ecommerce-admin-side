import { ColumnDef } from '@tanstack/react-table';
import CellAction from '../../components/cell_actions';

export type BillboardColumn = {
  label: string;
  id: string;
  createdAt: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label'
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