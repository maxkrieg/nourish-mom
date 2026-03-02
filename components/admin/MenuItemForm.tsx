'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MenuItem } from '@/lib/generated/prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TagInput } from '@/components/customer/TagInput'
import { toast } from 'sonner'

interface MenuItemFormProps {
  item?: MenuItem
}

export function MenuItemForm({ item }: MenuItemFormProps) {
  const router = useRouter()
  const isEdit = !!item

  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [tags, setTags] = useState<string[]>(item?.tags ?? [])
  const [price, setPrice] = useState(item ? String(item.price / 100) : '')
  const [available, setAvailable] = useState(item?.available ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!description.trim()) e.description = 'Description is required'
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) e.price = 'Enter a valid price'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaving(true)

    const body = {
      name: name.trim(),
      description: description.trim(),
      tags,
      price: Math.round(parseFloat(price) * 100),
      available,
    }

    const res = await fetch(isEdit ? `/api/admin/menu/${item!.id}` : '/api/admin/menu', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json = await res.json()
    setSaving(false)

    if (!res.ok) {
      toast.error('Failed to save menu item.', { style: { borderLeft: '4px solid #B85450' } })
    } else {
      toast.success(isEdit ? 'Menu item updated.' : 'Menu item created.', {
        style: { borderLeft: '4px solid #4A9B8E' },
      })
      router.push('/admin/menu')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-semibold text-neutral-text">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Slow-cooked Bone Broth"
          className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
        />
        {errors.name && <p className="text-sm text-error">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-semibold text-neutral-text">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the dish, key ingredients, and nutritional benefits…"
          rows={4}
          className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-teal leading-relaxed resize-none"
        />
        {errors.description && <p className="text-sm text-error">{errors.description}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price" className="text-sm font-semibold text-neutral-text">Price ($)</Label>
        <Input
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 18.50"
          type="number"
          min="0"
          step="0.01"
          className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
        />
        {errors.price && <p className="text-sm text-error">{errors.price}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-neutral-text">Dietary tags</Label>
        <p className="text-sm text-neutral-muted">Add tags like "high-iron", "breastfeeding-friendly", "gluten-free"</p>
        <TagInput value={tags} onChange={setTags} placeholder="Type a tag and press Enter" />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="available"
          checked={available}
          onCheckedChange={setAvailable}
          className="data-[state=checked]:bg-teal"
        />
        <Label htmlFor="available" className="text-sm font-semibold text-neutral-text cursor-pointer">
          Available for ordering
        </Label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="h-12 px-8 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create item'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/menu')}
          className="h-12 px-6 text-neutral-muted hover:text-neutral-text"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
