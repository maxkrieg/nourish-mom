'use client'

import { useRouter } from 'next/navigation'
import { useOrder } from '@/components/order/OrderContext'

interface OrderSummaryBarProps {
  isAuthenticated: boolean
}

export function OrderSummaryBar({ isAuthenticated }: OrderSummaryBarProps) {
  const router = useRouter()
  const { totalItems } = useOrder()

  if (totalItems === 0) return null

  function handleContinue() {
    if (!isAuthenticated) {
      router.push('/register?next=/order')
    } else {
      router.push('/order')
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-border shadow-lg px-6 py-4 flex items-center justify-between md:hidden">
      <p className="text-sm font-medium text-neutral-text">
        <span className="font-bold text-teal">{totalItems}</span>{' '}
        {totalItems === 1 ? 'item' : 'items'} selected
      </p>
      <button
        onClick={handleContinue}
        className="rounded-xl bg-teal text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-dark transition-all duration-150"
      >
        Continue to Notes →
      </button>
    </div>
  )
}
