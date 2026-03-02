'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

type OrderRow = {
  id: string
  status: OrderStatus
  createdAt: string
  frequency: string
  durationWeeks: number
  startDate: string
  user: { email: string }
  deliveryWindow: { label: string }
  items: { quantity: number; menuItem: { name: string } }[]
}

interface OrdersTableProps {
  orders: OrderRow[]
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-neutral-100 text-neutral-muted',
  CONFIRMED: 'bg-teal-light text-teal',
  PREPARING: 'bg-orange-50 text-warning',
  OUT_FOR_DELIVERY: 'bg-teal-light text-teal',
  DELIVERED: 'bg-teal-light text-teal',
  CANCELLED: 'bg-pink-light text-error',
}

export function OrdersTable({ orders: initial }: OrdersTableProps) {
  const [orders, setOrders] = useState(initial)

  async function updateStatus(orderId: string, status: OrderStatus) {
    const prevStatus = orders.find((o) => o.id === orderId)?.status
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: prevStatus! } : o)))
      toast.error('Failed to update order status.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      toast.success(`Order status updated to ${STATUS_LABELS[status]}.`, {
        style: { borderLeft: '4px solid #4A9B8E' },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-text">Orders</h1>
        <p className="text-sm text-neutral-muted mt-1">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-neutral-muted text-sm">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-border bg-neutral-bg">
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Meals</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Delivery Window</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Frequency</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Duration</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Start Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-bg transition-colors">
                    <td className="px-6 py-4 text-neutral-text font-medium whitespace-nowrap">
                      {order.user.email}
                    </td>
                    <td className="px-6 py-4 text-neutral-muted">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-neutral-muted whitespace-nowrap">
                      {order.deliveryWindow.label}
                    </td>
                    <td className="px-6 py-4 text-neutral-muted whitespace-nowrap">
                      {order.frequency.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 text-neutral-muted whitespace-nowrap">
                      {order.durationWeeks}w
                    </td>
                    <td className="px-6 py-4 text-neutral-muted whitespace-nowrap">
                      {new Date(order.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={order.status}
                        onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}
                      >
                        <SelectTrigger className={`h-8 w-44 rounded-full border-0 text-xs font-medium px-3 ${STATUS_COLORS[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs rounded-lg">
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
