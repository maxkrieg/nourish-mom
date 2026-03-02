'use client'

import { Minus, Plus, Utensils } from 'lucide-react'
import { useOrder, type SelectedItem } from './OrderContext'
import type { MenuItem } from '@/lib/generated/prisma/client'

interface MealSelectorProps {
  menuItems: MenuItem[]
  onNext: () => void
}

export function MealSelector({ menuItems, onNext }: MealSelectorProps) {
  const { order, setItems } = useOrder()

  function getQty(id: string) {
    return order.items.find((i) => i.menuItemId === id)?.quantity ?? 0
  }

  function adjust(item: MenuItem, delta: number) {
    const current = order.items.find((i) => i.menuItemId === item.id)
    const currentQty = current?.quantity ?? 0
    const newQty = Math.max(0, currentQty + delta)

    let updated: SelectedItem[]
    if (newQty === 0) {
      updated = order.items.filter((i) => i.menuItemId !== item.id)
    } else if (current) {
      updated = order.items.map((i) =>
        i.menuItemId === item.id ? { ...i, quantity: newQty } : i
      )
    } else {
      updated = [
        ...order.items,
        { menuItemId: item.id, name: item.name, price: item.price, quantity: newQty },
      ]
    }
    setItems(updated)
  }

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const available = menuItems.filter((m) => m.available)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-text">Select your meals</h2>
        <p className="text-sm text-neutral-muted mt-1">
          Choose one or more items from our menu.
        </p>
      </div>

      {available.length === 0 ? (
        <div className="py-16 text-center text-neutral-muted text-sm">
          No menu items available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {available.map((item) => {
            const qty = getQty(item.id)
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all duration-150 flex flex-col ${
                  qty > 0 ? 'border-teal shadow-teal/10' : 'border-neutral-border'
                }`}
              >
                <div className="rounded-t-2xl h-36 bg-teal-light flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-teal" strokeWidth={1.5} />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div>
                    <h3 className="font-semibold text-neutral-text">{item.name}</h3>
                    <p className="text-xs text-neutral-muted leading-relaxed line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-teal-light text-teal rounded-full px-2 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-neutral-text">
                      ${(item.price / 100).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjust(item, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-full border border-neutral-border flex items-center justify-center text-neutral-muted hover:border-teal hover:text-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold text-neutral-text">
                        {qty}
                      </span>
                      <button
                        onClick={() => adjust(item, 1)}
                        className="w-7 h-7 rounded-full border border-neutral-border flex items-center justify-center text-neutral-muted hover:border-teal hover:text-teal transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-border -mx-8 px-8 py-4 flex items-center justify-between">
        <span className="text-sm text-neutral-muted">
          {totalItems === 0
            ? 'No items selected'
            : `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`}
        </span>
        <button
          onClick={onNext}
          disabled={totalItems === 0}
          className="bg-teal text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
