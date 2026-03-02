import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })
  console.log('DB User:', dbUser)
  if (!dbUser || dbUser.role !== 'ADMIN') redirect('/menu')

  return (
    <div className="min-h-screen bg-neutral-bg">
      <AdminSidebar />
      <main className="ml-60 min-h-screen">
        <div className="max-w-[1120px] mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
