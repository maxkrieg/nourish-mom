'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, UtensilsCrossed, CalendarDays, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/schedule', label: 'Schedule', icon: CalendarDays },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-neutral-border flex flex-col z-20">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-border">
        <span className="text-lg font-bold tracking-tight text-teal">Nourish Mom</span>
        <span className="ml-2 text-xs font-medium tracking-widest uppercase text-neutral-muted">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-2 space-y-1">
        <p className="text-xs font-medium tracking-widest uppercase text-neutral-muted px-3 mb-3">
          Dashboard
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mx-0 ${
                active
                  ? 'bg-teal-light text-teal'
                  : 'text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text transition-all duration-150"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
