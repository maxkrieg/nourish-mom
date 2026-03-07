'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantityControlProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  disabled?: boolean
}

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || quantity === 0}
        aria-label="Decrease quantity"
        className="w-8 h-8 rounded-full flex items-center justify-center border border-teal text-teal hover:bg-teal hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-teal"
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>

      <span className="w-6 text-center text-sm font-semibold text-neutral-text tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase quantity"
        className="w-8 h-8 rounded-full flex items-center justify-center border border-teal text-teal hover:bg-teal hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
