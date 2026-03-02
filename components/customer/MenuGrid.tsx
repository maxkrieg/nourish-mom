'use client'

import { useState, useMemo } from 'react'
import type { MenuItem } from '@/lib/generated/prisma/client'
import { MenuItemCard } from './MenuItemCard'
import { TagFilter } from './TagFilter'
import { UtensilsCrossed } from 'lucide-react'

interface MenuGridProps {
  items: MenuItem[]
}

export function MenuGrid({ items }: MenuGridProps) {
  const [activeTags, setActiveTags] = useState<string[]>([])

  // Collect all unique tags across all items
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    items.forEach((item) => item.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [items])

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // AND logic — item must include ALL active tags
  const filtered = useMemo(() => {
    if (activeTags.length === 0) return items
    return items.filter((item) =>
      activeTags.every((tag) => item.tags.includes(tag))
    )
  }, [items, activeTags])

  return (
    <div className="space-y-8">
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <TagFilter
          tags={allTags}
          activeTags={activeTags}
          onToggle={toggleTag}
          onClear={() => setActiveTags([])}
        />
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <UtensilsCrossed className="w-12 h-12 text-teal-light mb-4" strokeWidth={1.5} />
          <h3 className="text-[18px] font-semibold text-neutral-text mb-1">
            No meals match your filters
          </h3>
          <p className="text-sm text-neutral-muted mb-6">
            Try removing some filters to see more options.
          </p>
          <button
            onClick={() => setActiveTags([])}
            className="rounded-xl bg-teal text-white px-6 py-3 text-sm font-semibold hover:bg-teal-dark transition-all duration-150"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
