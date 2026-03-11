'use client'

import { useState } from 'react'
import { OrderHistoryList } from './OrderHistoryList'
import { ProfileForm } from './ProfileForm'
import type { OrderCardData } from './OrderCard'
import type { Profile } from '@/lib/generated/prisma/client'

type Tab = 'orders' | 'profile'

interface AccountTabsProps {
  orders: OrderCardData[]
  profile: Profile | null
}

export function AccountTabs({ orders, profile }: AccountTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-neutral-border mb-8">
        <TabButton
          label="Orders"
          active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
        />
        <TabButton
          label="Profile"
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
      </div>

      {/* Tab panels */}
      {activeTab === 'orders' && <OrderHistoryList orders={orders} />}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6">
          <ProfileForm profile={profile} />
        </div>
      )}
    </div>
  )
}

interface TabButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
        active
          ? 'border-teal text-teal'
          : 'border-transparent text-neutral-muted hover:text-neutral-text'
      }`}
    >
      {label}
    </button>
  )
}
