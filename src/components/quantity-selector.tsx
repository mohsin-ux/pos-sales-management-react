import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, max, label, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={`Decrease quantity of ${label}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className={
          value <= 1
            ? 'disabled:pointer-events-auto disabled:cursor-not-allowed'
            : 'cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
        }
      >
        <Minus />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`Quantity of ${label}`}
        className="h-7 w-14 rounded-md border border-emerald-200 bg-white text-center font-medium text-emerald-900"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={
          value >= max
            ? 'disabled:pointer-events-auto disabled:cursor-not-allowed'
            : 'cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
        }
      >
        <Plus />
      </Button>
    </div>
  );
}
