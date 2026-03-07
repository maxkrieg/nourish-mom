'use client'

import { useRouter } from 'next/navigation'
import { useOrder } from '@/components/order/OrderContext'
import { ShoppingBag } from 'lucide-react'

interface OrderSummaryPanelProps {
  isAuthenticated: boolean
}

export function OrderSummaryPanel({ isAuthenticated }: OrderSummaryPanelProps) {
  const router = useRouter()
  const { items, orderTotal, clearOrder } = useOrder()

  if (items.length === 0) return null

  function handleContinue() {
    if (!isAuthenticated) {
      router.push('/register?next=/order')
    } else {
      router.push('/order')
    }
  }

  return (
    <aside className="sticky top-24 flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-teal" strokeWidth={2} />
          <h2 className="text-base font-bold text-neutral-text">Your Order</h2>
        </div>

        {/* Items */}
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.menuItemId} className="flex items-start justify-between gap-2 text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-text leading-snug truncate">{item.name}</p>
                <p className="text-xs text-neutral-muted">×{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-neutral-text whitespace-nowrap">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        {/* Divider + subtotal */}
        <div className="border-t border-neutral-border pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-text">Subtotal</span>
          <span className="text-sm font-bold text-teal">${(orderTotal / 100).toFixed(2)}</span>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-teal text-white py-3 text-sm font-semibold hover:bg-teal-dark transition-all duration-150"
        >
          Continue to Notes
        </button>

        {/* Clear all */}
        <button
          onClick={clearOrder}
          className="text-xs text-neutral-muted hover:text-error transition-colors text-center"
        >
          Clear all
        </button>
      </div>
    </aside>
  )
}
