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
        className="h-7 w-14 text-center border border border-black"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus />
      </Button>
    </div>
  );
}
