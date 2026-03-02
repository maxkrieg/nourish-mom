'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface Option {
  value: string
  label: string
}

interface MultiCheckboxProps {
  options: Option[]
  value: string[]
  onChange: (selected: string[]) => void
}

export function MultiCheckbox({ options, value, onChange }: MultiCheckboxProps) {
  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <Checkbox
            id={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={() => toggle(option.value)}
            className="data-[state=checked]:bg-teal data-[state=checked]:border-teal rounded-md"
          />
          <span className="text-sm text-neutral-text group-hover:text-teal transition-colors select-none">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
}
