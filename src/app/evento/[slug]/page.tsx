import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { RenderSection } from '@/themes/ThemeRegistry'
import CheckoutForm from '@/components/CheckoutForm'

export const dynamic = 'force-dynamic';

export default async function EventoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  // 1. Fetch Event
  const { data: evento } = await supabase
    .from('eventos')
    .select('*, productoras(nombre, logo_url, instagram, whatsapp, email)')
    .eq('slug', slug)
    .single()

  if (!evento || evento.estado !== 'published') {
    notFound()
  }

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
      <div>
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

      <div id="comprar" className="py-20 bg-neutral-950">
        <div className="max-w-md mx-auto px-6">
          <h3 className="text-white text-2xl font-bold text-center mb-8">Completar Compra</h3>
          <CheckoutForm eventoId={evento.id} precio={evento.precio_general} theme={{ primaryColor: '#ffffff', secondaryColor: '#888888', backgroundColor: '#000000' }} />
        </div>
      </div>
    </main>
  )
}
