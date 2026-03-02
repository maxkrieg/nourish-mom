'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type SelectedItem = {
  menuItemId: string
  name: string
  price: number // cents
  quantity: number
}

export type OrderState = {
  // Step 1
  items: SelectedItem[]
  // Step 2
  startDate: Date | undefined
  deliveryWindowId: string
  deliveryWindowLabel: string
  frequency: 'DAILY' | 'THREE_PER_WEEK' | 'TWICE_PER_WEEK' | 'WEEKLY' | ''
  durationWeeks: number
  // Step 3
  specialNotes: string
}

type OrderContextType = {
  order: OrderState
  setItems: (items: SelectedItem[]) => void
  setSchedule: (schedule: {
    startDate: Date
    deliveryWindowId: string
    deliveryWindowLabel: string
    frequency: OrderState['frequency']
    durationWeeks: number
  }) => void
  setNotes: (notes: string) => void
  reset: () => void
}

const defaultState: OrderState = {
  items: [],
  startDate: undefined,
  deliveryWindowId: '',
  deliveryWindowLabel: '',
  frequency: '',
  durationWeeks: 1,
  specialNotes: '',
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>(defaultState)

  function setItems(items: SelectedItem[]) {
    setOrder((prev) => ({ ...prev, items }))
  }

  function setSchedule(schedule: {
    startDate: Date
    deliveryWindowId: string
    deliveryWindowLabel: string
    frequency: OrderState['frequency']
    durationWeeks: number
  }) {
    setOrder((prev) => ({ ...prev, ...schedule }))
  }

  function setNotes(specialNotes: string) {
    setOrder((prev) => ({ ...prev, specialNotes }))
  }

  function reset() {
    setOrder(defaultState)
  }

  return (
    <OrderContext.Provider value={{ order, setItems, setSchedule, setNotes, reset }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within <OrderProvider>')
  return ctx
}
