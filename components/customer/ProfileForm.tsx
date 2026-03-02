'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagInput } from './TagInput'
import { MultiCheckbox } from './MultiCheckbox'
import { toast } from 'sonner'
import type { Profile } from '@/lib/generated/prisma/client'

const DIETARY_OPTIONS = [
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'nut-free', label: 'Nut-free' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
]

interface ProfileFormProps {
  profile: Profile | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.deliveryAddress ?? '')
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    profile?.dietaryRestrictions ?? []
  )
  const [allergies, setAllergies] = useState<string[]>(profile?.allergies ?? [])
  const [notes, setNotes] = useState(profile?.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryAddress, dietaryRestrictions, allergies, notes }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        toast.error('Failed to save profile. Please try again.', {
          style: { borderLeft: '4px solid #B85450' },
        })
      } else {
        toast.success('Profile saved successfully.', {
          style: { borderLeft: '4px solid #4A9B8E' },
        })
      }
    } catch {
      toast.error('Something went wrong. Please try again.', {
        style: { borderLeft: '4px solid #B85450' },
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Delivery Address */}
      <div className="space-y-1.5">
        <Label htmlFor="deliveryAddress" className="text-sm font-semibold text-neutral-text">
          Delivery address
        </Label>
        <Input
          id="deliveryAddress"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="123 Main St, City, State, ZIP"
          className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
        />
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-semibold text-neutral-text">
            Dietary restrictions
          </Label>
          <p className="text-sm text-neutral-muted mt-0.5">
            Select all that apply to help us tailor your meals.
          </p>
        </div>
        <MultiCheckbox
          options={DIETARY_OPTIONS}
          value={dietaryRestrictions}
          onChange={setDietaryRestrictions}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-neutral-text">
          Allergies
        </Label>
        <p className="text-sm text-neutral-muted mt-0.5">
          Add any specific ingredients you&apos;re allergic to.
        </p>
        <TagInput
          value={allergies}
          onChange={setAllergies}
          placeholder="e.g. shellfish, sesame"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-semibold text-neutral-text">
          Additional notes
          <span className="ml-1 font-normal text-neutral-muted">(optional)</span>
        </Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other preferences or details for our kitchen team…"
          rows={4}
          className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-teal leading-relaxed resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="h-12 px-8 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150"
      >
        {saving ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  )
}
