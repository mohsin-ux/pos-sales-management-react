import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type SelectedProduct } from '@/lib/types';

interface ConfirmSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SelectedProduct[];
  isPending: boolean;
  onConfirm: () => void;
}

export function ConfirmSaleDialog({
  open,
  onOpenChange,
  items,
  isPending,
  onConfirm,
}: ConfirmSaleDialogProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.salePrice) * item.quantity,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm sale</DialogTitle>
          <DialogDescription>Review the sale before submitting it.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>
            Products: <span className="font-medium text-foreground">{items.length}</span>
          </span>
          <span>
            Quantity: <span className="font-medium text-foreground">{totalQuantity}</span>
          </span>
          <span>
            Total: <span className="font-medium text-foreground">{totalPrice.toFixed(2)}</span>
          </span>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Creating sale...' : 'Confirm sale'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
