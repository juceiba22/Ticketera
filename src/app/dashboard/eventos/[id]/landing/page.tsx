import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { addSeccion, deleteSeccion, moveSeccion, toggleSeccionVisibility, updateSeccion, updateTheme } from './actions'
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic';

const AVAILABLE_THEMES = ['dark', 'rock', 'electronic', 'festival', 'corporate']
const AVAILABLE_SECTIONS = ['hero', 'lineup', 'tickets', 'galeria', 'sponsors', 'faq', 'contacto']

export default async function LandingBuilderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: evento, error } = await supabase
    .from('eventos')
    .select('id, nombre, slug, theme')
    .eq('id', params.id)
    .single()

  if (error || !evento) notFound()

  const { data: secciones } = await supabase
    .from('evento_secciones')
    .select('*')
    .eq('evento_id', evento.id)
    .order('orden', { ascending: true })

  const currentTheme = typeof evento.theme === 'object' && evento.theme !== null ? (evento.theme as { name?: string }).name || 'dark' : 'dark'

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
        <Link href={`/dashboard/eventos/${evento.id}/artistas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Artistas
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/landing`} className="px-4 py-3 border-b-2 border-white text-white font-medium whitespace-nowrap">
          Constructor Landing
        </Link>
        <Link href={`/dashboard/eventos/${evento.id}/ventas`} className="px-4 py-3 border-b-2 border-transparent text-neutral-400 hover:text-white transition-colors whitespace-nowrap">
          Ventas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Configurador */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Motor Visual (Theme)</h2>
            <form action={updateTheme} className="space-y-4">
              <input type="hidden" name="id" value={evento.id} />
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Tema Base</label>
                <select name="theme" defaultValue={currentTheme} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 text-white capitalize">
                  {AVAILABLE_THEMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition-colors">
                Aplicar Tema
              </button>
            </form>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Agregar Sección</h2>
            <form action={addSeccion} className="space-y-4">
              <input type="hidden" name="evento_id" value={evento.id} />
              <input type="hidden" name="orden" value={(secciones?.length || 0) + 1} />
              <div>
                <select name="tipo" className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 text-white capitalize">
                  {AVAILABLE_SECTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-white text-black font-medium rounded-xl hover:bg-neutral-200 transition-colors">
                + Agregar
              </button>
            </form>
          </div>
        </div>

        {/* Builder Area */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">Secciones de la Landing</h2>
          
          {secciones?.map((seccion, index) => (
            <div key={seccion.id} className={`bg-neutral-900 border border-neutral-800 p-4 rounded-xl transition-opacity ${seccion.visible ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-xs font-mono">#{seccion.orden}</span>
                  <h3 className="font-semibold capitalize text-lg">{seccion.tipo}</h3>
                </div>
                
                <div className="flex items-center gap-1">
                  <form action={moveSeccion}>
                    <input type="hidden" name="id" value={seccion.id} />
                    <input type="hidden" name="evento_id" value={evento.id} />
                    <input type="hidden" name="orden" value={seccion.orden - 1} />
                    <button type="submit" disabled={index === 0} className="p-2 hover:bg-neutral-800 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  </form>
                  <form action={moveSeccion}>
                    <input type="hidden" name="id" value={seccion.id} />
                    <input type="hidden" name="evento_id" value={evento.id} />
                    <input type="hidden" name="orden" value={seccion.orden + 1} />
                    <button type="submit" disabled={index === secciones.length - 1} className="p-2 hover:bg-neutral-800 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  </form>
                  <div className="w-px h-4 bg-neutral-800 mx-1"></div>
                  <form action={toggleSeccionVisibility}>
                    <input type="hidden" name="id" value={seccion.id} />
                    <input type="hidden" name="evento_id" value={evento.id} />
                    <input type="hidden" name="visible" value={seccion.visible.toString()} />
                    <button type="submit" className="p-2 hover:bg-neutral-800 rounded">
                      {seccion.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </form>
                  <form action={deleteSeccion}>
                    <input type="hidden" name="id" value={seccion.id} />
                    <input type="hidden" name="evento_id" value={evento.id} />
                    <button type="submit" className="p-2 hover:bg-red-900/30 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>

              {/* Contenido Dinámico de la Sección */}
              <form action={updateSeccion} className="space-y-3 bg-neutral-950 p-4 rounded-lg border border-neutral-800/50">
                <input type="hidden" name="id" value={seccion.id} />
                <input type="hidden" name="evento_id" value={evento.id} />
                
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Título Sobrescrito (Opcional)</label>
                  <input name="titulo" type="text" defaultValue={seccion.contenido_json?.titulo || ''} className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white text-sm" />
                </div>
                
                {['faq', 'contacto', 'hero'].includes(seccion.tipo) && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Texto o Contenido (Opcional)</label>
                    <textarea name="texto" rows={2} defaultValue={seccion.contenido_json?.texto || ''} className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 text-white text-sm"></textarea>
                  </div>
                )}
                
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-4 py-1.5 bg-neutral-800 text-white text-sm font-medium rounded hover:bg-neutral-700 transition-colors">Guardar Contenido</button>
                </div>
              </form>
            </div>
          ))}

          {!secciones?.length && (
            <div className="text-center py-12 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl border-dashed">
              <p>No has agregado ninguna sección a la Landing.</p>
              <p className="text-sm mt-1">Usa el panel lateral para empezar a construir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
