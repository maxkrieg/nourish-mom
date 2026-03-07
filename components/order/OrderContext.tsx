'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type OrderItem = {
  menuItemId: string
  name: string
  price: number // cents
  quantity: number
}

type OrderContextType = {
  items: OrderItem[]
  specialNotes: string
  addItem: (item: OrderItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  setSpecialNotes: (notes: string) => void
  clearOrder: () => void
  totalItems: number
  orderTotal: number
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [specialNotes, setSpecialNotesState] = useState('')

  function addItem(item: OrderItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId)
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  function removeItem(menuItemId: string) {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId))
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    )
  }

  function setSpecialNotes(notes: string) {
    setSpecialNotesState(notes)
  }

  function clearOrder() {
    setItems([])
    setSpecialNotesState('')
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const orderTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <OrderContext.Provider
      value={{
        items,
        specialNotes,
        addItem,
        removeItem,
        updateQuantity,
        setSpecialNotes,
        clearOrder,
        totalItems,
        orderTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within <OrderProvider>')
  return ctx
}
