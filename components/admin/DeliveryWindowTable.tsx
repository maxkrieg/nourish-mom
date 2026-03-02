'use client'

import { useState } from 'react'
import type { DeliveryWindow } from '@/lib/generated/prisma/client'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface DeliveryWindowTableProps {
  windows: DeliveryWindow[]
}

export function DeliveryWindowTable({ windows: initial }: DeliveryWindowTableProps) {
  const [windows, setWindows] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [capacity, setCapacity] = useState('')
  const [saving, setSaving] = useState(false)

  async function toggleActive(w: DeliveryWindow) {
    const updated = !w.active
    setWindows((prev) => prev.map((x) => (x.id === w.id ? { ...x, active: updated } : x)))

    const res = await fetch(`/api/admin/delivery-windows/${w.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: updated }),
    })

    if (!res.ok) {
      setWindows((prev) => prev.map((x) => (x.id === w.id ? { ...x, active: w.active } : x)))
      toast.error('Failed to update window.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      toast.success(`Window "${w.label}" ${updated ? 'activated' : 'deactivated'}.`, {
        style: { borderLeft: '4px solid #4A9B8E' },
      })
    }
  }

  async function addWindow(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/admin/delivery-windows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, startTime, endTime, capacity: parseInt(capacity, 10) }),
    })
    const json = await res.json()
    setSaving(false)

    if (!res.ok) {
      toast.error('Failed to create window.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      setWindows((prev) => [...prev, json.data])
      setLabel(''); setStartTime(''); setEndTime(''); setCapacity('')
      setShowForm(false)
      toast.success('Delivery window added.', { style: { borderLeft: '4px solid #4A9B8E' } })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-neutral-text">Delivery Windows</h2>
          <p className="text-sm text-neutral-muted mt-0.5">Define time slots customers can choose from.</p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="h-9 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150 gap-2 text-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Window
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addWindow} className="px-6 py-4 border-b border-neutral-border bg-neutral-bg">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <Label className="text-xs font-semibold text-neutral-muted uppercase tracking-widest">Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder='e.g. "Morning (8–11am)"' required className="h-10 rounded-xl border-neutral-border focus-visible:ring-teal text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-muted uppercase tracking-widest">Start</Label>
              <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" required className="h-10 rounded-xl border-neutral-border focus-visible:ring-teal text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-muted uppercase tracking-widest">End</Label>
              <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time" required className="h-10 rounded-xl border-neutral-border focus-visible:ring-teal text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-muted uppercase tracking-widest">Capacity</Label>
              <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} type="number" min="1" required placeholder="e.g. 20" className="h-10 rounded-xl border-neutral-border focus-visible:ring-teal text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={saving} className="h-9 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark">
              {saving ? 'Saving…' : 'Save window'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="h-9 text-neutral-muted text-sm">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {windows.length === 0 ? (
        <div className="py-12 text-center text-neutral-muted text-sm">No delivery windows yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-border bg-neutral-bg">
              <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Label</th>
              <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Time</th>
              <th className="text-left px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Capacity</th>
              <th className="text-center px-6 py-3 font-semibold text-neutral-muted text-xs tracking-widest uppercase">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {windows.map((w) => (
              <tr key={w.id} className="hover:bg-neutral-bg transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-text">{w.label}</td>
                <td className="px-6 py-4 text-neutral-muted">{w.startTime} – {w.endTime}</td>
                <td className="px-6 py-4 text-neutral-muted">{w.capacity} orders</td>
                <td className="px-6 py-4 text-center">
                  <Switch
                    checked={w.active}
                    onCheckedChange={() => toggleActive(w)}
                    className="data-[state=checked]:bg-teal"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
