'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { OrderStatus } from '@/lib/generated/prisma/client'

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-teal-light text-teal',
  CONFIRMED: 'bg-teal-light text-teal',
  PREPARING: 'bg-teal-light text-teal',
  OUT_FOR_DELIVERY: 'bg-pink-light text-pink',
  DELIVERED: 'bg-neutral-bg text-neutral-muted border border-neutral-border',
  CANCELLED: 'bg-red-50 text-error',
}

type OrderItem = {
  id: string
  quantity: number
  menuItem: {
    name: string
    price: number
  }
}

export type OrderCardData = {
  id: string
  status: OrderStatus
  createdAt: string // ISO string
  specialNotes: string | null
  items: OrderItem[]
}

interface OrderCardProps {
  order: OrderCardData
}

export function OrderCard({ order }: OrderCardProps) {
  const isActive = ACTIVE_STATUSES.includes(order.status)
  const [open, setOpen] = useState(false)

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  )

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0)

  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-bg transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <span className="text-sm font-medium text-neutral-text truncate">{date}</span>
          {!open && (
            <span className="text-sm text-neutral-muted hidden sm:inline">
              · {totalItems} {totalItems === 1 ? 'item' : 'items'} · ${(subtotal / 100).toFixed(2)}
            </span>
          )}
        </div>
        <div className="shrink-0 ml-3 text-neutral-muted">
          {open ? (
            <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
          )}
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t border-neutral-border">
          {/* Items list */}
          <ul className="divide-y divide-neutral-border">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 first:pt-4 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-text">{item.menuItem.name}</p>
                  <p className="text-xs text-neutral-muted">×{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-neutral-text">
                  ${((item.menuItem.price * item.quantity) / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-neutral-border pt-3">
            <span className="text-sm font-semibold text-neutral-text">Total</span>
            <span className="text-sm font-bold text-teal">${(subtotal / 100).toFixed(2)}</span>
          </div>

          {/* Special notes */}
          {order.specialNotes && (
            <div className="rounded-xl bg-neutral-bg border border-neutral-border px-4 py-3">
              <p className="text-xs font-semibold text-neutral-muted uppercase tracking-widest mb-1">
                Special instructions
              </p>
              <p className="text-sm text-neutral-text">{order.specialNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
