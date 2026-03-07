'use client'

import { useRouter } from 'next/navigation'
import { useOrder } from './OrderContext'
import { OrderStepIndicator } from './OrderStepIndicator'

const MAX_CHARS = 500

export function NotesForm() {
  const router = useRouter()
  const { specialNotes, setSpecialNotes } = useOrder()

  const remaining = MAX_CHARS - specialNotes.length

  return (
    <div className="flex flex-col gap-8">
      {/* Step indicator */}
      <OrderStepIndicator currentStep={2} />

      <div>
        <h2 className="text-2xl font-bold text-neutral-text">Any special instructions?</h2>
        <p className="text-sm text-neutral-muted mt-1">
          Let the kitchen know about allergies, preferences, or anything else. This is optional.
        </p>
      </div>

      {/* Notes textarea */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6 flex flex-col gap-3">
        <label
          htmlFor="specialNotes"
          className="text-sm font-semibold text-neutral-text"
        >
          Special instructions
          <span className="ml-1 text-xs font-normal text-neutral-muted">(optional)</span>
        </label>
        <textarea
          id="specialNotes"
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Any instructions for the kitchen? (allergies, preferences, access notes)"
          rows={5}
          className="w-full resize-none rounded-xl border border-neutral-border px-4 py-3 text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-teal transition-all duration-150"
        />
        <p
          className={`text-xs text-right ${
            remaining < 50 ? 'text-warning' : 'text-neutral-muted'
          }`}
        >
          {remaining} characters remaining
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/menu')}
          className="text-sm text-neutral-muted hover:text-neutral-text transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/order/review')}
            className="text-sm text-neutral-muted hover:text-teal transition-colors underline underline-offset-2"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => router.push('/order/review')}
            className="rounded-xl bg-teal text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-dark transition-all duration-150"
          >
            Review My Order
          </button>
        </div>
      </div>
    </div>
  )
}
