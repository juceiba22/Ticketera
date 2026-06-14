import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Edit, Eye, Trash2 } from 'lucide-react'

type EventoTicket = {
  id?: string
  monto?: number
}

type DashboardEvent = {
  id: string
  nombre: string
  slug: string
  fecha_evento?: string
  estado?: string
  tickets?: EventoTicket[]
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: productora } = await supabase
    .from('productoras')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!productora) {
    return <div className="text-red-500">Error: Productora no encontrada para el usuario actual.</div>
  }

  const { data: eventos, error: eventosError } = await supabase
    .from('eventos')
    .select('id, nombre, fecha_evento, estado, precio_general, slug, tickets(id, monto)')
    .eq('productora_id', productora.id)
    .order('created_at', { ascending: false })

  if (eventosError) {
    return <div className="text-red-500">Error al cargar eventos: {eventosError.message}</div>
  }

  // Resumen
  const cantEventos = eventos?.length || 0
  let totalTickets = 0
  let recaudacionTotal = 0

  eventos?.forEach((evento: DashboardEvent) => {
    totalTickets += evento.tickets?.length || 0
    evento.tickets?.forEach((t) => {
      recaudacionTotal += Number(t.monto)
    })
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Resumen General</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Eventos Activos</p>
          <p className="text-4xl font-bold mt-2">{cantEventos}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Tickets Vendidos</p>
          <p className="text-4xl font-bold mt-2">{totalTickets}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Recaudación Total</p>
          <p className="text-4xl font-bold mt-2">${recaudacionTotal}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Tus Eventos</h2>
          <Link href="/dashboard/eventos/nuevo" className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
            + Nuevo Evento
          </Link>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-light">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Ventas</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!eventos?.length && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">
                      No tienes eventos creados. <Link href="/dashboard/eventos/nuevo" className="text-white hover:underline">Crea tu primer evento</Link>.
                    </td>
                  </tr>
                )}
                {eventos?.map((evento: DashboardEvent) => {
                  const cantTickets = evento.tickets?.length || 0
                  const recaudacion = evento.tickets?.reduce((acc, t) => acc + Number(t.monto), 0) || 0

                  return (
                    <tr key={evento.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                      <td className="p-4 font-medium">{evento.nombre}</td>
                      <td className="p-4 text-neutral-400">
                        {evento.fecha_evento ? new Date(evento.fecha_evento).toLocaleDateString() : 'Sin definir'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          evento.estado === 'published' ? 'bg-green-900/50 text-green-400' : 
                          evento.estado === 'draft' ? 'bg-neutral-800 text-neutral-300' : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          {evento.estado}
                        </span>
                      </td>
                      <td className="p-4">
                        {cantTickets} tickets (${recaudacion})
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={evento.estado === 'published' ? `/evento/${evento.slug}` : `/preview/${evento.slug}`} target="_blank" className="inline-flex p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors" title={evento.estado === 'published' ? "Ver Landing Pública" : "Vista Previa"}>
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/eventos/${evento.id}`} className="inline-flex p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
