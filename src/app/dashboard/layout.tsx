import Link from 'next/link'
import { logout } from './actions'
import { createClient } from '@/utils/supabase/server'
import { Calendar, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let productoraNombre = "Productora"
  if (user) {
    const { data: productora } = await supabase
      .from('productoras')
      .select('nombre')
      .eq('auth_user_id', user.id)
      .single()
    if (productora) {
      productoraNombre = productora.nombre
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight">Portal Productoras</h2>
          <p className="text-sm text-neutral-500 mt-1 truncate">{productoraNombre}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Resumen</span>
          </Link>
          <Link href="/dashboard/eventos/nuevo" className="flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Crear Evento</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <form action={logout}>
            <button className="flex w-full items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors text-left">
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
