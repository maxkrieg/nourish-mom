import { MenuItemForm } from '@/components/admin/MenuItemForm'

export default function NewMenuItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-text">Add menu item</h1>
        <p className="text-sm text-neutral-muted mt-1">Create a new dish for your customers.</p>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6">
        <MenuItemForm />
      </div>
    </div>
  )
}
