'use client'

import type { MenuItem } from '@/lib/generated/prisma/client'
import { AvailabilityBadge } from './AvailabilityBadge'
import { QuantityControl } from './QuantityControl'
import { useOrder } from '@/components/order/OrderContext'
import { Utensils } from 'lucide-react'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useOrder()
  const orderItem = items.find((i) => i.menuItemId === item.id)
  const quantity = orderItem?.quantity ?? 0

  function handleIncrement() {
    if (orderItem) {
      updateQuantity(item.id, quantity + 1)
    } else {
      addItem({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1 })
    }
  }

  function handleDecrement() {
    updateQuantity(item.id, quantity - 1)
  }

  const selected = quantity > 0

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col transition-all duration-150 ${
        selected
          ? 'border-teal ring-1 ring-teal'
          : 'border-neutral-border'
      } ${
        item.available
          ? 'hover:shadow-md hover:-translate-y-0.5'
          : 'opacity-60'
      }`}
    >
      {/* Image placeholder */}
      <div
        className={`rounded-t-2xl h-44 flex items-center justify-center relative ${
          item.available ? 'bg-teal-light' : 'bg-neutral-border'
        }`}
      >
        <Utensils
          className={`w-10 h-10 ${item.available ? 'text-teal' : 'text-neutral-disabled'}`}
          strokeWidth={1.5}
        />
        {/* Availability badge — top right */}
        <div className="absolute top-3 right-3">
          <AvailabilityBadge available={item.available} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-neutral-text leading-snug">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-neutral-muted leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-teal-light text-teal rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + quantity controls */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-sm font-bold text-neutral-text">
            ${(item.price / 100).toFixed(2)}
          </span>
          <QuantityControl
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={!item.available}
          />
        </div>
      </div>
    </div>
  )
}
