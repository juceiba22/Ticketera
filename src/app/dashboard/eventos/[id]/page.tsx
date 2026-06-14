import { updateEvento, deleteEvento } from '../actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EventUploaderFields from '../nuevo/EventUploaderFields'
import ConfirmButton from '@/components/ui/ConfirmButton'
import SubmitButton from '@/components/ui/SubmitButton'

export const dynamic = 'force-dynamic';

export default async function EditEventoPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string, success?: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const { data: evento, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !evento) {
    notFound()
  }

  // Format date for datetime-local input
  let formattedDate = ''
  if (evento.fecha_evento) {
    const d = new Date(evento.fecha_evento)
    formattedDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
        <Link href={`/dashboard/eventos/${evento.id}`} className="px-4 py-3 border-b-2 border-white text-white font-medium whitespace-nowrap">
          Información
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/artistas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Artistas
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/landing`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Constructor Landing
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/ventas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Ventas
        </Link>
      </div>

      {resolvedSearchParams?.error && (
        <div className="bg-red-900/50 text-red-400 p-4 rounded-xl text-sm">
          Hubo un error al actualizar el evento.
        </div>
      )}
      {resolvedSearchParams?.success && (
        <div className="bg-green-900/50 text-green-400 p-4 rounded-xl text-sm">
          Evento actualizado exitosamente.
        </div>
      )}

      <form action={updateEvento} className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-6">
        <input type="hidden" name="id" value={evento.id} />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">Información General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="nombre">Nombre del Evento</label>
              <input id="nombre" name="nombre" type="text" required defaultValue={evento.nombre} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="slug">Slug (URL)</label>
              <input id="slug" name="slug" type="text" required defaultValue={evento.slug} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows={3} defaultValue={evento.descripcion || ''} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="fecha">Fecha y Hora</label>
              <input id="fecha" name="fecha" type="datetime-local" defaultValue={formattedDate} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white color-scheme-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="estado">Estado</label>
              <select id="estado" name="estado" defaultValue={evento.estado} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white">
                <option value="draft">Borrador</option>
                <option value="preview">Preview</option>
                <option value="published">Publicado</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2 pt-4">Venta</h2>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="precio">Precio General (ARS)</label>
            <input id="precio" name="precio" type="number" required min="1" defaultValue={evento.precio_general} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2 pt-4">Diseño Visual</h2>
          <EventUploaderFields defaultFlyer={evento.flyer_url || ''} defaultVideo={evento.video_url || ''} />
        </div>

        <div className="pt-6 flex gap-4">
          <SubmitButton className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
            Guardar Cambios
          </SubmitButton>
        </div>
      </form>
      
      <div className="pt-10 border-t border-neutral-800">
        <form action={deleteEvento}>
           <input type="hidden" name="id" value={evento.id} />
           <ConfirmButton 
             className="px-4 py-2 bg-red-900/30 text-red-500 hover:bg-red-900/50 transition-colors rounded-lg font-medium"
             buttonContent="Eliminar Evento"
             confirmTitle="Eliminar Evento"
             confirmMessage={`¿Estás seguro que deseas eliminar "${evento.nombre}"? Esta acción no se puede deshacer y se borrarán todos los artistas y datos asociados.`}
             confirmText="Eliminar"
           />
        </form>
      </div>
    </div>
  )
}
