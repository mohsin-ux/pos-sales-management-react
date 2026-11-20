import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getApiErrorMessage } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { productApi } from '@/lib/product-api';

export function ProductsPage() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.list,
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>All products available in your store.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {true && <p className="text-sm text-muted-foreground">Loading products...</p>}

          {isError && (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && products?.length === 0 && (
            <p className="text-sm text-muted-foreground">No products found.</p>
          )}

          {!isLoading && !isError && products && products.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Sale price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Created</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Link
            to={ROUTES.HOME}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
