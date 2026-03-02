import { prisma } from '@/lib/prisma'
import { MenuTable } from '@/components/admin/MenuTable'

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: 'asc' } })

  return <MenuTable items={items} />
}
