import { createEvento } from '../actions'
import Link from 'next/link'

export default function NuevoEventoPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crear Nuevo Evento</h1>
        <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Volver</Link>
      </div>

      {searchParams?.error && (
        <div className="bg-red-900/50 text-red-400 p-4 rounded-xl text-sm">
          Hubo un error al crear el evento. Revisa que el slug sea único y todos los datos estén correctos.
        </div>
      )}

      <form action={createEvento} className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-6">
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2">Información General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="nombre">Nombre del Evento</label>
              <input id="nombre" name="nombre" type="text" required className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="slug">Slug (URL)</label>
              <input id="slug" name="slug" type="text" required placeholder="ej: fiesta-pagana-2" className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows={3} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="fecha">Fecha y Hora</label>
              <input id="fecha" name="fecha" type="datetime-local" className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white color-scheme-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="estado">Estado</label>
              <select id="estado" name="estado" className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white">
                <option value="draft">Borrador</option>
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
            <input id="precio" name="precio" type="number" required min="1" className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-neutral-800 pb-2 pt-4">Diseño (Opcional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="flyer">Flyer URL (Imagen)</label>
              <input id="flyer" name="flyer" type="url" placeholder="https://..." className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="video">Video URL de Fondo</label>
              <input id="video" name="video" type="url" placeholder="https://..." className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
            Guardar y Continuar
          </button>
        </div>
      </form>
    </div>
  )
}
