import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { RenderSection } from '@/themes/ThemeRegistry'
import CheckoutForm from '@/components/CheckoutForm'

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  // 1. Fetch Event
  const { data: evento } = await supabase
    .from('eventos')
    .select('*, productoras(nombre, logo_url, instagram, whatsapp, email)')
    .eq('slug', slug)
    .single()

  if (!evento) notFound()

  // 2. Fetch Sections
  const { data: secciones } = await supabase
    .from('evento_secciones')
    .select('*')
    .eq('evento_id', evento.id)
    .eq('visible', true)
    .order('orden', { ascending: true })

  // 3. Fetch Artists
  const { data: artistas } = await supabase
    .from('artistas')
    .select('*')
    .eq('evento_id', evento.id)
    .order('orden', { ascending: true })

  const themeName = typeof evento.theme === 'object' && evento.theme !== null ? (evento.theme as any).name || 'dark' : 'dark'
  
  // Si no hay secciones configuradas, mostramos una estructura por defecto
  const hasSections = secciones && secciones.length > 0
  const renderSecciones = hasSections ? secciones : [
    { tipo: 'hero', contenido_json: {} },
    { tipo: 'lineup', contenido_json: {} },
    { tipo: 'tickets', contenido_json: {} }
  ]

  return (
    <main className="min-h-screen bg-black">
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-bold z-50">
        MODO VISTA PREVIA
      </div>
      
      <div className="pt-8">
        {renderSecciones.map((s: { id?: string; tipo: string; contenido_json?: { titulo?: string; texto?: string } }, idx: number) => (
          <RenderSection 
            key={s.id || idx}
            themeName={themeName}
            sectionName={s.tipo}
            props={{
              evento,
              artistas: artistas || [],
              productora: evento.productoras,
              seccion: s
            }}
          />
        ))}
      </div>

      {/* Checkout section is always injected at the bottom for demo purposes if it's not a block */}
      <div id="comprar" className="py-20 bg-neutral-950">
        <div className="max-w-md mx-auto">
          <h3 className="text-white text-2xl font-bold text-center mb-8">Adquirir Entradas</h3>
          <CheckoutForm eventoId={evento.id} precio={evento.precio_general} theme={{ primaryColor: '#ffffff', secondaryColor: '#888888', backgroundColor: '#000000' }} />
        </div>
      </div>
    </main>
  )
}
