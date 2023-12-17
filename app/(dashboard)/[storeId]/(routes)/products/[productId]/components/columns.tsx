import { ColumnDef } from '@tanstack/react-table';
import CellAction from '../../components/cell_actions';

export type ProductColumn = {
  name: string;
  id: string;
  size: string;
  color: string;
  isFeatured: string;
  isArchived: string;
  price: string;
  category: string;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        { row.original.color }
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured'
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived'
  },
  {
    accessorKey: 'category',
    header: 'Category'
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