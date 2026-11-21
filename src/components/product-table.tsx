import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Product } from '@/lib/types';

interface ProductTableProps {
  products: Product[];
  onRemove?: (product: Product) => void;
}

export function ProductTable({ products, onRemove }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Sale price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Created</TableHead>
          {onRemove && <TableHead className="w-10 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{Number(product.salePrice).toFixed(2)}</TableCell>
            <TableCell>{product.stockQuantity}</TableCell>
            <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
            {onRemove && (
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => onRemove(product)}
                >
                  <X />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
