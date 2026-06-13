import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileWarning, Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const supabase = await createClient()

  // Fetch all objects from buckets to display (for the current user, or broadly in this case)
  // RLS doesn't apply to storage.list by default in a simple way without complicated policies, 
  // so we list using service role if needed, or better: just let the user know this is a global view
  // Actually, we can fetch event files by using the current user's productora events.
  // For simplicity, we just list files in the productoras bucket for their ID.

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: productora } = await supabase
    .from('productoras')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  const { data: files, error } = await supabase.storage.from('productoras').list(productora?.id || '')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Gestor Multimedia</h1>
        <p className="text-neutral-400 mt-1">Sube y administra tus recursos visuales de manera centralizada.</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-900 text-blue-400 p-4 rounded-xl flex gap-3 text-sm">
        <Info className="w-5 h-5 shrink-0" />
        <p>Los archivos vinculados a Eventos (Flyers y Videos) o Artistas se gestionan directamente desde sus respectivas pantallas de edición para mayor comodidad. Aquí verás los archivos genéricos de tu productora (como Logos).</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Archivos de Productora</h2>
        
        {files && files.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map(file => {
              if (file.name === '.emptyFolderPlaceholder') return null
              const url = supabase.storage.from('productoras').getPublicUrl(`${productora?.id}/${file.name}`).data.publicUrl
              return (
                <div key={file.id} className="relative aspect-square bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden group">
                  <img src={url} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-xs truncate text-neutral-300" title={file.name}>{file.name}</p>
                    <p className="text-xs text-neutral-500">
                      {typeof file.metadata?.size === 'number' ? `${(file.metadata.size / 1024).toFixed(1)} KB` : 'Tamaño desconocido'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 flex flex-col items-center">
            <FileWarning className="w-12 h-12 mb-3 opacity-50" />
            <p>No tienes archivos subidos en tu carpeta.</p>
          </div>
        )}
      </div>
    </div>
  )
}
