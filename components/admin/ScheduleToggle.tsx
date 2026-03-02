'use client'

import { useState } from 'react'
import type { OperatingSchedule } from '@/lib/generated/prisma/client'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface ScheduleToggleProps {
  schedules: OperatingSchedule[]
}

export function ScheduleToggle({ schedules: initial }: ScheduleToggleProps) {
  // Build a map from dayOfWeek → open, filling in defaults for missing days
  const [schedules, setSchedules] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {}
    for (let i = 0; i <= 6; i++) {
      const found = initial.find((s) => s.dayOfWeek === i)
      map[i] = found ? found.open : true
    }
    return map
  })

  async function toggleDay(day: number) {
    const newValue = !schedules[day]
    setSchedules((prev) => ({ ...prev, [day]: newValue }))

    const res = await fetch(`/api/admin/schedule/${day}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ open: newValue }),
    })

    if (!res.ok) {
      setSchedules((prev) => ({ ...prev, [day]: !newValue }))
      toast.error('Failed to update schedule.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      toast.success(`${DAY_NAMES[day]} marked as ${newValue ? 'open' : 'closed'}.`, {
        style: { borderLeft: '4px solid #4A9B8E' },
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-border">
        <h2 className="text-[18px] font-semibold text-neutral-text">Operating Days</h2>
        <p className="text-sm text-neutral-muted mt-0.5">Toggle which days deliveries are available.</p>
      </div>
      <div className="divide-y divide-neutral-border">
        {DAY_NAMES.map((name, day) => (
          <div key={day} className="flex items-center justify-between px-6 py-4">
            <span className="text-sm font-medium text-neutral-text">{name}</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${schedules[day] ? 'text-teal' : 'text-neutral-muted'}`}>
                {schedules[day] ? 'Open' : 'Closed'}
              </span>
              <Switch
                checked={schedules[day]}
                onCheckedChange={() => toggleDay(day)}
                className="data-[state=checked]:bg-teal"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
