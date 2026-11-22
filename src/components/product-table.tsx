import { X } from 'lucide-react';

import { QuantitySelector } from '@/components/quantity-selector';
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
  quantities?: Record<string, number>;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
}

export function ProductTable({
  products,
  quantities,
  onQuantityChange,
  onRemove,
}: ProductTableProps) {
  const showQuantity = Boolean(quantities && onQuantityChange);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Sale price</TableHead>
          {showQuantity && <TableHead>Quantity</TableHead>}
          {showQuantity && <TableHead>Subtotal</TableHead>}
          <TableHead>Stock</TableHead>
          <TableHead>Created</TableHead>
          {onRemove && <TableHead className="w-10 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const quantity = quantities?.[product.id] ?? 1;
          const maxQuantity = Math.max(1, product.stockQuantity);

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{Number(product.salePrice).toFixed(2)}</TableCell>
              {showQuantity && (
                <TableCell>
                  <QuantitySelector
                    value={quantity}
                    max={maxQuantity}
                    label={product.name}
                    onChange={(value) => onQuantityChange?.(product.id, value)}
                  />
                </TableCell>
              )}
              {showQuantity && (
                <TableCell>{(Number(product.salePrice) * quantity).toFixed(2)}</TableCell>
              )}
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
              {onRemove && (
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => onRemove(product.id)}
                  >
                    <X />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
