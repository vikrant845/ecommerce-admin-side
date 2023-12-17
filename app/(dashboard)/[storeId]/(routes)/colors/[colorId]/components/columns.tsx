import { ColumnDef } from '@tanstack/react-table';
import CellAction from '../../components/cell_actions';

export type ColorColumn = {
  name: string;
  value: string;
  id: string;
  createdAt: string;
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        { row.original.value }
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.value }} />
      </div>
    )
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