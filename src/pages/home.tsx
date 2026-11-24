import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { ConfirmSaleDialog } from '@/components/confirm-sale-dialog';
import { ProductTable } from '@/components/product-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/lib/api';
import { authApi } from '@/lib/auth-api';
import { ROUTES } from '@/lib/constants';
import { productApi } from '@/lib/product-api';
import { saleApi } from '@/lib/sale-api';
import { type CreateSaleRequest, type Product, type SelectedProduct } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

export function HomePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  /**
   * fetching all the products
   */
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
    .filter((product) => !selectedProducts.some((selected) => selected.product.id === product.id))
    .slice(0, 8);

  const handleSelect = (product: Product) => {
    if (!isSuggestionsOpen) return;
    setSelectedProducts((current) =>
      current.some((selected) => selected.product.id === product.id)
        ? current
        : [...current, { product, quantity: 1 }],
    );
    setIsSuggestionsOpen(false);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts((current) =>
      current.map((selected) => {
        if (selected.product.id !== productId) {
          return selected;
        }

        const maxQuantity = Math.max(1, selected.product.stockQuantity);
        const nextQuantity = Number.isNaN(quantity) ? 1 : Math.floor(quantity);

        return {
          ...selected,
          quantity: Math.min(maxQuantity, Math.max(1, nextQuantity)),
        };
      }),
    );
  };

  const handleRemove = (productId: string) => {
    setSelectedProducts((current) =>
      current.filter((selected) => selected.product.id !== productId),
    );
  };

  const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + Number(item.product.salePrice) * item.quantity,
    0,
  );

  /**
   * create sale call api
   */

  const createSaleMutation = useMutation({
    mutationFn: (payload: CreateSaleRequest) => saleApi.create(payload),
    onSuccess: () => {
      setIsConfirmOpen(false);
      toast.success('Sale created successfully');
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSearch('');
    },
    onError: (mutationError) => {
      toast.error(getApiErrorMessage(mutationError));
    },
  });

  const handleCreateSale = () => {
    createSaleMutation.mutate({
      items: selectedProducts.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    });
  };

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      clearUser();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });

  return (
    <div className="mx-auto my-10 w-full max-w-5xl px-4">
      <Card className="bg-white shadow-sm ring-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold tracking-tight text-emerald-950">
            Quick POS
          </CardTitle>
          <CardDescription className="text-base text-emerald-900/60">
            Search for products by name and select one or more.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-800" />
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
              className="h-11 rounded-xl border-emerald-200 bg-emerald-50/70 pl-9 text-emerald-950 placeholder:text-emerald-900/40 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20"
            />

            {isSuggestionsOpen && suggestions.length > 0 && (
              <div
                id="product-suggestions"
                role="listbox"
                aria-label="Product suggestions"
                aria-multiselectable="true"
                className="absolute z-10 mt-1 w-full overflow-auto rounded-xl border border-emerald-100 bg-white p-1 text-popover-foreground shadow-lg"
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
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-emerald-50"
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
                <h2 className="text-lg font-semibold text-emerald-950">
                  Selected products ({selectedProducts.length})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setSelectedProducts([])}
                >
                  Clear all
                </Button>
              </div>
              <div className="overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40">
                <ProductTable
                  products={selectedProducts.map((selected) => selected.product)}
                  quantities={Object.fromEntries(
                    selectedProducts.map((selected) => [selected.product.id, selected.quantity]),
                  )}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              </div>
              <div className="flex flex-wrap items-end justify-end gap-x-8 gap-y-4">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Products
                  </span>
                  <span className="text-lg font-semibold text-emerald-950">
                    {selectedProducts.length}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Quantity
                  </span>
                  <span className="text-lg font-semibold text-emerald-950">{totalQuantity}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-emerald-800">
                    <span className="text-black font-semibold text-lg">Rs.</span>{' '}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  type="button"
                  className="h-11 cursor-pointer rounded-xl px-6 font-semibold shadow-sm"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Create sale
                </Button>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowProductList((current) => !current)}
            className="h-10 w-full cursor-pointer rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            {showProductList ? 'Hide full product list' : 'View full product list'}
          </Button>

          {showProductList && (
            <div className="flex flex-col gap-3 border-t border-emerald-100 pt-4">
              <p className="text-lg font-semibold text-emerald-950">All products</p>
              {products && products.length > 0 ? (
                <ProductTable products={products} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isLoading
                    ? 'Loading products...'
                    : isError
                      ? getApiErrorMessage(error)
                      : 'No products found.'}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmSaleDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        items={selectedProducts}
        isPending={createSaleMutation.isPending}
        onConfirm={handleCreateSale}
      />
    </div>
  );
}
