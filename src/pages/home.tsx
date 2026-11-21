import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { ProductTable } from '@/components/product-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { productApi } from '@/lib/product-api';
import { type Product } from '@/lib/types';

export function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

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

  const searchTerm = search.trim().toLowerCase();

  const matchingProducts = searchTerm
    ? (products ?? []).filter((product) => product.name.toLowerCase().includes(searchTerm))
    : [];

  const suggestions = matchingProducts
    .filter((product) => !selectedProducts.some((selected) => selected.id === product.id))
    .slice(0, 8);

  const handleSelect = (product: Product) => {
    setSelectedProducts((current) =>
      current.some((selected) => selected.id === product.id) ? current : [...current, product],
    );
    setIsSuggestionsOpen(true);
  };

  const handleRemove = (product: Product) => {
    setSelectedProducts((current) => current.filter((selected) => selected.id !== product.id));
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Search for products by name and select one or more.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setIsSuggestionsOpen(event.target.value.trim().length > 0);
              }}
              onFocus={() => setIsSuggestionsOpen(searchTerm.length > 0)}
              onBlur={() => setIsSuggestionsOpen(false)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsSuggestionsOpen(false);
                } else if (event.key === 'Enter' && suggestions.length > 0) {
                  event.preventDefault();
                  handleSelect(suggestions[0]);
                }
              }}
              placeholder="Search products by name..."
              aria-label="Search products by name"
              aria-expanded={isSuggestionsOpen && suggestions.length > 0}
              aria-controls="product-suggestions"
              autoComplete="off"
              className="pl-8"
            />

            {isSuggestionsOpen && suggestions.length > 0 && (
              <div
                id="product-suggestions"
                role="listbox"
                aria-label="Product suggestions"
                aria-multiselectable="true"
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
              >
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(product);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}

          {isError && (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          )}

          {!isLoading &&
            !isError &&
            searchTerm.length > 0 &&
            suggestions.length === 0 &&
            matchingProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No products match &ldquo;{search.trim()}&rdquo;.
              </p>
            )}

          {!isLoading &&
            !isError &&
            searchTerm.length > 0 &&
            suggestions.length === 0 &&
            matchingProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                All matching products are already selected.
              </p>
            )}

          {!isLoading && !isError && !searchTerm && selectedProducts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Start typing a product name to see suggestions.
            </p>
          )}

          {!isLoading && !isError && selectedProducts.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected products ({selectedProducts.length})</p>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
                  Clear all
                </Button>
              </div>
              <ProductTable products={selectedProducts} onRemove={handleRemove} />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link
              to={ROUTES.PRODUCTS}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              View full product list
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Go to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
