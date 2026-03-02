'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MenuItem } from '@/lib/generated/prisma/client'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface MenuTableProps {
  items: MenuItem[]
}

export function MenuTable({ items: initialItems }: MenuTableProps) {
  const [items, setItems] = useState(initialItems)
  const router = useRouter()

  async function toggleAvailability(item: MenuItem) {
    const updated = !item.available
    // Optimistic update
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: updated } : i)))

    const res = await fetch(`/api/admin/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: updated }),
    })

    if (!res.ok) {
      // Revert
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: item.available } : i)))
      toast.error('Failed to update availability.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      toast.success(`${item.name} marked as ${updated ? 'available' : 'sold out'}.`, {
        style: { borderLeft: '4px solid #4A9B8E' },
      })
    }
  }

  async function deleteItem(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/menu/${item.id}`, { method: 'DELETE' })
    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? 'Failed to delete item.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      toast.success(`"${item.name}" deleted.`, { style: { borderLeft: '4px solid #4A9B8E' } })
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-semibold tracking-tight text-neutral-text">Menu Items</h2>
        <Link href="/admin/menu/new">
          <Button className="h-10 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150 gap-2">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Item
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center text-neutral-muted text-sm">
            No menu items yet. Add your first item above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-bg">
                <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Tags</th>
                <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Price</th>
                <th className="text-center px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Available</th>
                <th className="text-right px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-bg transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-text">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="bg-teal-light text-teal rounded-full px-2 py-0.5 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length === 0 && <span className="text-neutral-muted">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-muted">
                    ${(item.price / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item)}
                      className="data-[state=checked]:bg-teal"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/menu/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-muted hover:text-teal">
                          <Pencil className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-neutral-muted hover:text-error"
                        onClick={() => deleteItem(item)}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
