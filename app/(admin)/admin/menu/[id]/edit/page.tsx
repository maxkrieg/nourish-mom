import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MenuItemForm } from '@/components/admin/MenuItemForm'

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.menuItem.findUnique({ where: { id } })

  if (!item) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-text">Edit menu item</h1>
        <p className="text-sm text-neutral-muted mt-1">Update the details for "{item.name}".</p>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6">
        <MenuItemForm item={item} />
      </div>
    </div>
  )
}
