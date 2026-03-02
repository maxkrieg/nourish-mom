'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useOrder, type OrderState } from './OrderContext'

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

interface ScheduleFormProps {
  deliveryWindows: DeliveryWindow[]
  operatingSchedule: OperatingDay[]
  onNext: () => void
  onBack: () => void
}

const FREQUENCY_OPTIONS: { value: OrderState['frequency']; label: string; description: string }[] =
  [
    { value: 'DAILY', label: 'Daily', description: '7 deliveries per week' },
    { value: 'THREE_PER_WEEK', label: '3× per week', description: 'Mon, Wed, Fri' },
    { value: 'TWICE_PER_WEEK', label: 'Twice per week', description: 'Two days of your choice' },
    { value: 'WEEKLY', label: 'Weekly', description: 'Once per week' },
  ]

const DURATION_OPTIONS = [1, 2, 3, 4]

export function ScheduleForm({
  deliveryWindows,
  operatingSchedule,
  onNext,
  onBack,
}: ScheduleFormProps) {
  const { order, setSchedule } = useOrder()

  const [startDate, setStartDate] = useState<Date | undefined>(order.startDate)
  const [windowId, setWindowId] = useState(order.deliveryWindowId)
  const [frequency, setFrequency] = useState<OrderState['frequency']>(order.frequency)
  const [durationWeeks, setDurationWeeks] = useState(order.durationWeeks)

  // Build a set of closed day-of-week numbers (0=Sun…6=Sat)
  const closedDays = new Set(
    operatingSchedule.filter((d) => !d.open).map((d) => d.dayOfWeek)
  )

  function isDisabled(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    return closedDays.has(date.getDay())
  }

  function handleContinue() {
    if (!startDate || !windowId || !frequency) return
    const win = deliveryWindows.find((w) => w.id === windowId)
    setSchedule({
      startDate,
      deliveryWindowId: windowId,
      deliveryWindowLabel: win?.label ?? '',
      frequency,
      durationWeeks,
    })
    onNext()
  }

  const isValid = !!startDate && !!windowId && !!frequency

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-text">Set your schedule</h2>
        <p className="text-sm text-neutral-muted mt-1">
          Choose when and how often you'd like deliveries.
        </p>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-semibold text-neutral-text mb-3">
          Start date
        </label>
        <div className="inline-block bg-white border border-neutral-border rounded-2xl p-4 shadow-sm">
          <DayPicker
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            disabled={isDisabled}
            classNames={{
              today: 'font-bold text-teal',
              selected: 'bg-teal text-white rounded-lg',
              day_button: 'rounded-lg',
            }}
          />
        </div>
      </div>

      {/* Delivery Window */}
      <div>
        <label className="block text-sm font-semibold text-neutral-text mb-3">
          Delivery window
        </label>
        {deliveryWindows.length === 0 ? (
          <p className="text-sm text-neutral-muted">No delivery windows available.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {deliveryWindows.map((w) => (
              <label
                key={w.id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  windowId === w.id
                    ? 'border-teal bg-teal-light'
                    : 'border-neutral-border bg-white hover:border-teal/50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryWindow"
                  value={w.id}
                  checked={windowId === w.id}
                  onChange={() => setWindowId(w.id)}
                  className="accent-teal"
                />
                <span className="text-sm font-medium text-neutral-text">{w.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-semibold text-neutral-text mb-3">
          Delivery frequency
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                frequency === opt.value
                  ? 'border-teal bg-teal-light'
                  : 'border-neutral-border bg-white hover:border-teal/50'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value={opt.value}
                checked={frequency === opt.value}
                onChange={() => setFrequency(opt.value)}
                className="accent-teal mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-neutral-text">{opt.label}</p>
                <p className="text-xs text-neutral-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-neutral-text mb-3">
          Duration
        </label>
        <select
          value={durationWeeks}
          onChange={(e) => setDurationWeeks(Number(e.target.value))}
          className="bg-white border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-neutral-text focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
        >
          {DURATION_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w} {w === 1 ? 'week' : 'weeks'}
            </option>
          ))}
        </select>
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-border -mx-8 px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-neutral-muted hover:text-neutral-text transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="bg-teal text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
