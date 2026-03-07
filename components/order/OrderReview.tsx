'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useOrder } from './OrderContext'
import { OrderStepIndicator } from './OrderStepIndicator'
import { toast } from 'sonner'

export function OrderReview() {
  const router = useRouter()
  const { items, specialNotes, orderTotal, clearOrder } = useOrder()
  const [loading, setLoading] = useState(false)

  // Guard: if context is empty (e.g. direct nav or page refresh), send back to menu
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your order is empty. Please select some meals first.')
      router.replace('/menu')
    }
  }, [items.length, router])

  if (items.length === 0) return null

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItems: items.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
          specialNotes: specialNotes || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.data?.url) {
        toast.error(json.error ?? 'Failed to create checkout session. Please try again.')
        return
      }

      clearOrder()
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
      {/* Step indicator */}
      <OrderStepIndicator currentStep={3} />

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
          {items.map((item) => (
            <li key={item.menuItemId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-neutral-text">{item.name}</p>
                <p className="text-xs text-neutral-muted">×{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-neutral-text">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-neutral-border pt-3">
          <span className="text-sm font-semibold text-neutral-text">Order total</span>
          <span className="text-sm font-bold text-teal">${(orderTotal / 100).toFixed(2)}</span>
        </div>
      </section>

      {/* Special notes */}
      <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
          Special Instructions
        </h3>
        <p className="text-sm text-neutral-muted">
          {specialNotes || 'None'}
        </p>
      </section>

      {/* Payment note */}
      <p className="text-sm text-neutral-muted text-center">
        You will be charged{' '}
        <span className="font-semibold text-neutral-text">${(orderTotal / 100).toFixed(2)}</span>{' '}
        upon confirmation.
      </p>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-border -mx-6 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/order')}
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
