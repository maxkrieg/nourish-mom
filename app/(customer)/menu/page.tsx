import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { MenuGrid } from '@/components/customer/MenuGrid'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const items = await prisma.menuItem.findMany({
    orderBy: [{ available: 'desc' }, { createdAt: 'asc' }],
  })

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-border sticky top-0 z-10">
        <div className="max-w-[1120px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-teal">Nourish Mom</span>
          <nav className="flex items-center gap-6">
            <a href="/menu" className="text-sm text-teal font-medium">
              Menu
            </a>
            {user && (
              <>
                <a href="/account" className="text-sm text-neutral-muted hover:text-teal transition-colors">
                  Account
                </a>
                <LogoutButton showIcon={false} className="text-sm text-neutral-muted hover:text-teal px-0" />
              </>
            )}
            {!user && (
              <>
                <a href="/login" className="text-sm text-neutral-muted hover:text-teal transition-colors">
                  Sign in
                </a>
                <a
                  href="/register"
                  className="text-sm bg-teal text-white rounded-xl px-4 py-2 font-semibold hover:bg-teal-dark transition-all duration-150"
                >
                  Get started
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-neutral-border py-12">
        <div className="max-w-[1120px] mx-auto px-6 lg:px-10">
          <p className="text-xs font-medium tracking-widest uppercase text-teal mb-3">
            Our Menu
          </p>
          <h1 className="text-[36px] font-bold tracking-tight text-neutral-text mb-3">
            Nourishing meals, delivered.
          </h1>
          <p className="text-base text-neutral-muted leading-relaxed max-w-xl">
            Every dish is crafted to support postpartum recovery — rich in iron, protein, and the
            nutrients your body needs most.
          </p>
        </div>
      </section>

      {/* Menu grid */}
      <main className="max-w-[1120px] mx-auto px-6 lg:px-10 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[18px] font-semibold text-neutral-text mb-2">
              Menu coming soon
            </p>
            <p className="text-sm text-neutral-muted">
              We&apos;re finalising our dishes. Check back shortly.
            </p>
          </div>
        ) : (
          <MenuGrid items={items} />
        )}
      </main>
    </div>
  )
}
