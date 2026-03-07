'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

interface OrderStepIndicatorProps {
  currentStep: 1 | 2 | 3
}

const STEPS = [
  { number: 1, label: 'Meals', href: '/menu' },
  { number: 2, label: 'Notes', href: '/order' },
  { number: 3, label: 'Review', href: '/order/review' },
]

export function OrderStepIndicator({ currentStep }: OrderStepIndicatorProps) {
  return (
    <nav aria-label="Order steps" className="flex items-center gap-1">
      {STEPS.map((step, index) => {
        const done = step.number < currentStep
        const active = step.number === currentStep

        const content = (
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              active
                ? 'bg-teal text-white'
                : done
                ? 'bg-teal-light text-teal'
                : 'bg-neutral-bg text-neutral-muted'
            }`}
          >
            {done ? (
              <Check className="w-3 h-3" strokeWidth={3} />
            ) : (
              <span>{step.number}</span>
            )}
            {step.label}
          </span>
        )

        return (
          <div key={step.number} className="flex items-center gap-1">
            {/* Step button — only completed steps are clickable */}
            {done ? (
              <Link href={step.href}>{content}</Link>
            ) : (
              <div>{content}</div>
            )}

            {/* Connector */}
            {index < STEPS.length - 1 && (
              <span className="text-neutral-muted text-xs mx-0.5">→</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
