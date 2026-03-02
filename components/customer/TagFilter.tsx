'use client'

interface TagFilterProps {
  tags: string[]
  activeTags: string[]
  onToggle: (tag: string) => void
  onClear: () => void
}

export function TagFilter({ tags, activeTags, onToggle, onClear }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={onClear}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
          activeTags.length === 0
            ? 'bg-teal text-white'
            : 'bg-white border border-neutral-border text-neutral-muted hover:border-teal hover:text-teal'
        }`}
      >
        All
      </button>

      {tags.map((tag) => {
        const active = activeTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-teal text-white'
                : 'bg-white border border-neutral-border text-neutral-muted hover:border-teal hover:text-teal'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
