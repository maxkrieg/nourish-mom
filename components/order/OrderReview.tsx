'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useOrder } from './OrderContext'
import { toast } from 'sonner'

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: 'Daily',
  THREE_PER_WEEK: '3× per week',
  TWICE_PER_WEEK: 'Twice per week',
  WEEKLY: 'Weekly',
}

export function OrderReview() {
  const router = useRouter()
  const { order } = useOrder()
  const [loading, setLoading] = useState(false)

  // Guard: if context is empty (e.g. direct nav or page refresh), send back to start
  useEffect(() => {
    if (order.items.length === 0) {
      toast.error('Your order is empty. Please start from the beginning.')
      router.replace('/order')
    }
  }, [order.items.length, router])

  if (order.items.length === 0) return null

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  async function handleCheckout() {
    if (!order.startDate || !order.deliveryWindowId || !order.frequency) {
      toast.error('Incomplete order. Please go back and fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItems: order.items.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
          deliveryWindowId: order.deliveryWindowId,
          frequency: order.frequency,
          durationWeeks: order.durationWeeks,
          startDate: order.startDate.toISOString(),
          specialNotes: order.specialNotes || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.data?.url) {
        toast.error(json.error ?? 'Failed to create checkout session. Please try again.')
        return
      }

      window.location.href = json.data.url
      // Leave loading=true — browser is navigating to Stripe
      return
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-text">Review your order</h2>
        <p className="text-sm text-neutral-muted mt-1">
          Confirm everything looks right before proceeding to payment.
        </p>
      </div>

      {/* Meals */}
      <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
          Meals
        </h3>
        <ul className="divide-y divide-neutral-border">
          {order.items.map((item) => (
            <li key={item.menuItemId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-neutral-text">{item.name}</p>
                <p className="text-xs text-neutral-muted">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-neutral-text">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-neutral-border pt-3">
          <span className="text-sm font-semibold text-neutral-text">Estimated subtotal</span>
          <span className="text-sm font-semibold text-teal">${(subtotal / 100).toFixed(2)}</span>
        </div>
        <p className="text-xs text-neutral-muted">
          Final pricing confirmed at checkout. Recurring charges based on frequency and duration.
        </p>
      </section>

      {/* Schedule */}
      <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
          Schedule
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-neutral-muted">Start date</p>
            <p className="font-medium text-neutral-text">
              {order.startDate
                ? order.startDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Delivery window</p>
            <p className="font-medium text-neutral-text">{order.deliveryWindowLabel || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Frequency</p>
            <p className="font-medium text-neutral-text">
              {order.frequency ? FREQUENCY_LABELS[order.frequency] : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Duration</p>
            <p className="font-medium text-neutral-text">
              {order.durationWeeks} {order.durationWeeks === 1 ? 'week' : 'weeks'}
            </p>
          </div>
        </div>
      </section>

      {/* Special notes */}
      {order.specialNotes && (
        <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
            Special Instructions
          </h3>
          <p className="text-sm text-neutral-muted">{order.specialNotes}</p>
        </section>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-border -mx-6 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="text-sm text-neutral-muted hover:text-neutral-text transition-colors disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-teal text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Redirecting…' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  )
}
