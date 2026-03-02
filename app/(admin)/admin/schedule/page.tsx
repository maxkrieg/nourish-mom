import { prisma } from '@/lib/prisma'
import { ScheduleToggle } from '@/components/admin/ScheduleToggle'
import { DeliveryWindowTable } from '@/components/admin/DeliveryWindowTable'

export default async function AdminSchedulePage() {
  const [schedules, windows] = await Promise.all([
    prisma.operatingSchedule.findMany({ orderBy: { dayOfWeek: 'asc' } }),
    prisma.deliveryWindow.findMany({ orderBy: { startTime: 'asc' } }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-text">Schedule</h1>
        <p className="text-sm text-neutral-muted mt-1">Manage operating days and delivery time slots.</p>
      </div>
      <ScheduleToggle schedules={schedules} />
      <DeliveryWindowTable windows={windows} />
    </div>
  )
}
