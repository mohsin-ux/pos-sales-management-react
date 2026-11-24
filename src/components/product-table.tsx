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
      <TableHeader className="bg-emerald-100 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-emerald-700 [&_th]:uppercase">
        <TableRow className="border-emerald-100 hover:bg-transparent">
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
            <TableRow key={product.id} className="border-emerald-100 hover:bg-emerald-50/60">
              <TableCell className="font-semibold text-emerald-950">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.sku}</TableCell>
              <TableCell className="font-medium">{Number(product.salePrice).toFixed(2)}</TableCell>
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
                <TableCell className="font-medium">
                  {(Number(product.salePrice) * quantity).toFixed(2)}
                </TableCell>
              )}
              <TableCell className="font-semibold text-emerald-800">
                {product.stockQuantity}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
              {onRemove && (
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-xs"
                    className="cursor-pointer"
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
