import { OrderCard } from './OrderCard'
import type { OrderCardData } from './OrderCard'
import type { OrderStatus } from '@/lib/generated/prisma/client'
import { ShoppingBag } from 'lucide-react'

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']

interface OrderHistoryListProps {
  orders: OrderCardData[]
}

export function OrderHistoryList({ orders }: OrderHistoryListProps) {
  const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status))
  const history = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status))

  return (
    <div className="flex flex-col gap-10">
      {/* Active orders */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-muted uppercase tracking-widest mb-4">
          Active orders
        </h2>
        {active.length === 0 ? (
          <EmptyState message="No active orders right now." />
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Order history */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-muted uppercase tracking-widest mb-4">
          Order history
        </h2>
        {history.length === 0 ? (
          <EmptyState message="No past orders yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border border-dashed border-neutral-border bg-white text-center">
      <ShoppingBag className="w-7 h-7 text-neutral-disabled" strokeWidth={1.5} />
      <p className="text-sm text-neutral-muted">{message}</p>
    </div>
  )
}
