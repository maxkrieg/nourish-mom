import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { AccountTabs } from '@/components/customer/AccountTabs'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { User } from 'lucide-react'
import type { OrderCardData } from '@/components/customer/OrderCard'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profile, rawOrders] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: user.id },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            menuItem: { select: { name: true, price: true } },
          },
        },
      },
    }),
  ])

  // Serialize dates before passing to client components
  const orders: OrderCardData[] = rawOrders.map((order) => ({
    id: order.id,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    specialNotes: order.specialNotes,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      menuItem: {
        name: item.menuItem.name,
        price: item.menuItem.price,
      },
    })),
  }))

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-border">
        <div className="max-w-[1120px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-teal">Nourish Mom</span>
          <nav className="flex items-center gap-6">
            <a href="/menu" className="text-sm text-neutral-muted hover:text-teal transition-colors">
              Menu
            </a>
            <a href="/account" className="text-sm text-teal font-medium">
              Account
            </a>
            <LogoutButton showIcon={false} className="text-sm text-neutral-muted hover:text-teal px-0" />
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-[1120px] mx-auto px-6 lg:px-10 py-12">
        <div className="max-w-2xl">
          {/* Page heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center">
              <User className="w-5 h-5 text-teal" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-neutral-text">
                Your account
              </h1>
              <p className="text-sm text-neutral-muted">{user.email}</p>
            </div>
          </div>

          <AccountTabs orders={orders} profile={profile} />
        </div>
      </main>
    </div>
  )
}
