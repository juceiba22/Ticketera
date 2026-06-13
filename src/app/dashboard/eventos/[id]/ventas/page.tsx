import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic';

export default async function VentasPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: evento, error } = await supabase
    .from('eventos')
    .select('id, nombre, slug, tickets(*)')
    .eq('id', params.id)
    .single()

  if (error || !evento) {
    notFound()
  }

  const tickets = evento.tickets || []
  
  const aprobados = tickets.filter((t: any) => t.estado_pago === 'approved')
  const pendientes = tickets.filter((t: any) => t.estado_pago === 'pending')
  
  const recaudacion = aprobados.reduce((acc: number, curr: any) => acc + Number(curr.monto), 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="text-neutral-400 mt-1">{evento.nombre}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">Volver</Link>
          <Link href={`/preview/${evento.slug}`} target="_blank" className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">Vista Previa</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-1 border-b border-neutral-800 pb-1">
        <Link href={`/dashboard/eventos/${evento.id}`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Información
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/artistas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Artistas
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/landing`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Constructor Landing
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/ventas`} className="px-4 py-3 border-b-2 border-white text-white font-medium whitespace-nowrap">
          Ventas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Tickets Vendidos</p>
          <p className="text-4xl font-bold mt-2 text-white">{aprobados.length}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Pendientes de Pago</p>
          <p className="text-4xl font-bold mt-2 text-yellow-500">{pendientes.length}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light text-sm uppercase tracking-wider">Total Recaudado</p>
          <p className="text-4xl font-bold mt-2 text-green-400">${recaudacion}</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-light">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Estado Pago</th>
                <th className="p-4">MP ID</th>
              </tr>
            </thead>
            <tbody>
              {!tickets.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Todavía no hay ventas registradas.
                  </td>
                </tr>
              )}
              {tickets.map((t: any) => (
                <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                  <td className="p-4">{t.email_comprador}</td>
                  <td className="p-4 font-medium">{t.nombre_comprador}</td>
                  <td className="p-4 text-neutral-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">${t.monto}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.estado_pago === 'approved' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-500'
                    }`}>
                      {t.estado_pago.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-neutral-500">{t.mercadopago_payment_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
