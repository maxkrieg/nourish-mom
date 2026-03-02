import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { OrdersTable } from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
  await requireAdmin()

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      deliveryWindow: { select: { label: true } },
      items: {
        include: {
          menuItem: { select: { name: true } },
        },
      },
    },
  })

  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    startDate: o.startDate.toISOString(),
  }))

  return <OrdersTable orders={serialized} />
}
