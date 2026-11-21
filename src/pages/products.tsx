import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

import { ProductTable } from '@/components/product-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
          {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}

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
            <ProductTable products={products} />
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
