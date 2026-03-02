import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderReview } from '@/components/order/OrderReview'

export default async function OrderReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

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
        <OrderReview />
      </div>
    </div>
  )
}
