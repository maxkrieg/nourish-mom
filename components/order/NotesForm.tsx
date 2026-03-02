'use client'

import { useState } from 'react'
import { useOrder } from './OrderContext'

interface NotesFormProps {
  onNext: () => void
  onBack: () => void
}

export function NotesForm({ onNext, onBack }: NotesFormProps) {
  const { order, setNotes } = useOrder()
  const [notes, setLocalNotes] = useState(order.specialNotes)

  function handleContinue() {
    setNotes(notes)
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-text">Any special instructions?</h2>
        <p className="text-sm text-neutral-muted mt-1">
          Optional — let the kitchen know about allergies, preferences, or anything else.
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setLocalNotes(e.target.value)}
        placeholder="e.g. Please avoid cilantro. Leave at the front door."
        rows={5}
        className="w-full bg-white border border-neutral-border rounded-xl px-4 py-3 text-sm text-neutral-text placeholder:text-neutral-disabled focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
      />

      <div className="sticky bottom-0 bg-white border-t border-neutral-border -mx-8 px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-neutral-muted hover:text-neutral-text transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-teal text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-teal/90 transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  )
}
