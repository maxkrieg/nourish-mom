import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { CheckCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  if (!session_id) redirect('/menu')

  const order = await prisma.order.findFirst({
    where: { stripePaymentId: session_id, userId: user.id },
    include: {
      items: { include: { menuItem: { select: { name: true, price: true } } } },
    },
  })

  if (!order) {
    // Order may not be created yet if webhook is delayed — show a generic message
    return (
      <div className="min-h-screen bg-neutral-bg flex flex-col">
        <nav className="bg-white border-b border-neutral-border px-6 py-4">
          <a href="/menu" className="text-lg font-bold text-teal tracking-tight">
            Nourish Mom
          </a>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-teal" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-text">Payment received!</h1>
            <p className="text-sm text-neutral-muted">
              Your order is being confirmed. You&apos;ll receive a confirmation email shortly.
            </p>
            <a
              href="/menu"
              className="mt-2 text-sm text-teal font-medium hover:underline"
            >
              Back to menu
            </a>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-neutral-bg">
      <nav className="bg-white border-b border-neutral-border px-6 py-4">
        <a href="/menu" className="text-lg font-bold text-teal tracking-tight">
          Nourish Mom
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-text">Order confirmed!</h1>
            <p className="text-sm text-neutral-muted mt-1">
              Thank you for choosing Nourish Mom. A confirmation email is on its way.
            </p>
          </div>
        </div>

        {/* Meals */}
        <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
            Your Meals
          </h3>
          <ul className="divide-y divide-neutral-border">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-text">{item.menuItem.name}</p>
                  <p className="text-xs text-neutral-muted">×{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-neutral-text">
                  ${((item.menuItem.price * item.quantity) / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-neutral-border pt-3">
            <span className="text-sm font-semibold text-neutral-text">Total paid</span>
            <span className="text-sm font-bold text-teal">${(subtotal / 100).toFixed(2)}</span>
          </div>
        </section>

        {/* Special notes */}
        {order.specialNotes && (
          <section className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-neutral-text uppercase tracking-widest">
              Special Instructions
            </h3>
            <p className="text-sm text-neutral-muted">{order.specialNotes}</p>
          </section>
        )}

        <div className="flex justify-center">
          <a
            href="/menu"
            className="text-sm text-teal font-medium hover:underline"
          >
            Back to menu
          </a>
        </div>
      </div>
    </div>
  )
}
