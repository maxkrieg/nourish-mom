'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MealSelector } from './MealSelector'
import { ScheduleForm } from './ScheduleForm'
import { NotesForm } from './NotesForm'
import { useOrder } from './OrderContext'
import type { MenuItem } from '@/lib/generated/prisma/client'

type DeliveryWindow = {
  id: string
  label: string
  startTime: string
  endTime: string
}

type OperatingDay = {
  dayOfWeek: number
  open: boolean
}

interface OrderStepperProps {
  menuItems: MenuItem[]
  deliveryWindows: DeliveryWindow[]
  operatingSchedule: OperatingDay[]
}

const STEPS = ['Select Meals', 'Schedule', 'Notes', 'Review']

export function OrderStepper({ menuItems, deliveryWindows, operatingSchedule }: OrderStepperProps) {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { order } = useOrder()

  function goNext() {
    if (step < 2) {
      setStep((s) => s + 1)
    } else {
      // Step 3 → navigate to review page
      router.push('/order/review')
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < step
                    ? 'bg-teal text-white'
                    : i === step
                    ? 'bg-teal text-white ring-4 ring-teal/20'
                    : 'bg-neutral-border text-neutral-muted'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i === step ? 'text-teal' : 'text-neutral-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 transition-colors ${
                  i < step ? 'bg-teal' : 'bg-neutral-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div>
        {step === 0 && <MealSelector menuItems={menuItems} onNext={goNext} />}
        {step === 1 && (
          <ScheduleForm
            deliveryWindows={deliveryWindows}
            operatingSchedule={operatingSchedule}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 2 && <NotesForm onNext={goNext} onBack={goBack} />}
      </div>
    </div>
  )
}
