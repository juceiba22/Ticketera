import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { addArtista, deleteArtista, editArtista } from './actions'
import { Trash2 } from 'lucide-react'
import ArtistImageUploader from './ArtistImageUploader'
import ConfirmButton from '@/components/ui/ConfirmButton'

export const dynamic = 'force-dynamic';

export default async function ArtistasPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: productora } = await supabase
    .from('productoras')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!productora) {
    notFound()
  }
  
  const { data: evento, error } = await supabase
    .from('eventos')
    .select('id, nombre, slug')
    .eq('id', id)
    .eq('productora_id', productora.id)
    .single()

  if (error || !evento) {
    notFound()
  }

  const { data: artistas } = await supabase
    .from('artistas')
    .select('*')
    .eq('evento_id', evento.id)
    .order('orden', { ascending: true })

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
        <Link href={`/dashboard/eventos/${evento.id}`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Información
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/artistas`} className="px-4 py-3 border-b-2 border-white text-white font-medium whitespace-nowrap">
          Artistas
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/landing`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Constructor Landing
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/ventas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Ventas
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-6">
        <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">Line-up</h2>

        {/* Existing Artists */}
        <div className="space-y-4">
          {artistas?.map((artista) => (
            <form key={artista.id} action={editArtista} className="flex flex-col gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <input type="hidden" name="id" value={artista.id} />
              <input type="hidden" name="evento_id" value={evento.id} />
              
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="w-full md:w-20">
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Orden</label>
                  <input name="orden" type="number" defaultValue={artista.orden} className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white" />
                </div>
                <div className="w-full flex-1">
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Nombre</label>
                  <input name="nombre" type="text" required defaultValue={artista.nombre} className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white" />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Imagen (Foto del Artista)</label>
                <div className="w-32">
                  <ArtistImageUploader defaultUrl={artista.imagen_url || ''} />
                </div>
              </div>
              
              <div className="flex gap-2 w-full justify-end border-t border-neutral-900 pt-3">
                <input type="hidden" name="evento_id" value={evento.id} />
                <ConfirmButton 
                  formAction={deleteArtista}
                  className="p-2 bg-red-900/30 text-red-500 rounded-lg hover:bg-red-900/50 transition-colors flex items-center justify-center"
                  buttonContent={<Trash2 className="w-5 h-5"/>}
                  confirmTitle="Eliminar Artista"
                  confirmMessage={`¿Estás seguro que deseas eliminar a ${artista.nombre}?`}
                  confirmText="Eliminar"
                />
                <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">Guardar</button>
              </div>
            </form>
          ))}
          {!artistas?.length && (
            <p className="text-neutral-500 text-sm text-center py-4">No hay artistas cargados aún.</p>
          )}
        </div>

        {/* Add New Artist */}
        <div className="pt-6 border-t border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Agregar Artista</h3>
          <form action={addArtista} className="flex flex-col gap-4 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 border-dashed">
            <input type="hidden" name="evento_id" value={evento.id} />
            
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full md:w-20">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Orden</label>
                <input name="orden" type="number" defaultValue={(artistas?.length || 0) + 1} className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white" />
              </div>
              <div className="w-full flex-1">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Nombre</label>
                <input name="nombre" type="text" required placeholder="Ej: Nina Kraviz" className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white" />
              </div>
            </div>
            
            <div className="w-full">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Imagen (Foto del Artista)</label>
              <div className="w-32">
                <ArtistImageUploader />
              </div>
            </div>
            
            <div className="flex justify-end pt-3">
              <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
                Agregar Artista
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
