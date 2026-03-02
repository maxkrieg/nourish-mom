import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { OrderStepper } from '@/components/order/OrderStepper'

export default async function OrderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [menuItems, deliveryWindows, operatingSchedule] = await Promise.all([
    prisma.menuItem.findMany({ where: { available: true }, orderBy: { name: 'asc' } }),
    prisma.deliveryWindow.findMany({ where: { active: true }, orderBy: { startTime: 'asc' } }),
    prisma.operatingSchedule.findMany({ orderBy: { dayOfWeek: 'asc' } }),
  ])

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Nav */}
      <nav className="bg-white border-b border-neutral-border px-6 py-4 flex items-center justify-between">
        <a href="/menu" className="text-lg font-bold text-teal tracking-tight">
          Nourish Mom
        </a>
        <a href="/account" className="text-sm text-neutral-muted hover:text-neutral-text transition-colors">
          My Account
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <OrderStepper
          menuItems={menuItems}
          deliveryWindows={deliveryWindows}
          operatingSchedule={operatingSchedule}
        />
      </div>
    </div>
  )
}
