interface AvailabilityBadgeProps {
  available: boolean
}

export function AvailabilityBadge({ available }: AvailabilityBadgeProps) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-teal-light text-teal rounded-full px-3 py-1 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-teal" />
        Available
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-muted rounded-full px-3 py-1 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-disabled" />
      Sold Out
    </span>
  )
}
