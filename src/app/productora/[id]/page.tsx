import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building, Mail, MessageCircle, Calendar, ArrowLeft, ExternalLink } from 'lucide-react'

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export const dynamic = 'force-dynamic';


interface ProductoraPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductoraPageProps) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: productora } = await supabase
    .from('productoras')
    .select('nombre')
    .eq('id', id)
    .single()

  return {
    title: productora ? `Eventos de ${productora.nombre} | Ticketera` : 'Perfil de la Productora',
    description: productora 
      ? `Conoce los próximos eventos organizados por ${productora.nombre}. Adquiere tus entradas de forma segura en Ticketera.` 
      : 'Explora el perfil de la productora y sus eventos en Ticketera.'
  }
}

export default async function ProductoraProfilePage({ params }: ProductoraPageProps) {
  const supabase = await createClient()
  const { id } = await params

  // 1. Obtener información de la productora
  const { data: productora, error: prodError } = await supabase
    .from('productoras')
    .select('*')
    .eq('id', id)
    .single()

  if (prodError || !productora) {
    notFound()
  }

  // 2. Obtener eventos publicados de la productora
  const { data: eventos, error: eventsError } = await supabase
    .from('eventos')
    .select('*')
    .eq('productora_id', id)
    .eq('estado', 'published')
    .order('fecha_evento', { ascending: true })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white">
      {/* Barra de Navegación superior */}
      <header className="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            id="nav-home-link"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Ticketera</span>
          </Link>
          <span className="font-bold tracking-tighter text-lg">TICKETERA</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-12">
        {/* Cabecera del Perfil con Banner */}
        <section id="producer-header" className="relative bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 min-h-[300px]">
          {/* Fondo gradiente decorativo */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-indigo-950/20 to-neutral-900 z-0" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl z-0" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0" />

          {/* Contenedor del Logo */}
          <div className="relative z-10 flex-shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-neutral-850 bg-neutral-950 flex items-center justify-center shadow-xl">
            {productora.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={productora.logo_url} 
                alt={`Logo de ${productora.nombre}`} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Building className="w-12 h-12 text-neutral-700 animate-pulse" />
            )}
          </div>

          {/* Detalles e Info de la Productora */}
          <div className="relative z-10 text-center md:text-left space-y-4 flex-1">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2.5">
                {productora.nombre}
                <span 
                  className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold shadow-sm" 
                  title="Productora Verificada"
                >
                  ✓
                </span>
              </h1>
              <p className="text-neutral-400 text-sm md:text-base max-w-xl">
                Organizador oficial de eventos en Ticketera. Explora nuestra cartelera a continuación.
              </p>
            </div>

            {/* Redes y Contacto */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {productora.email && (
                <a 
                  id="contact-email"
                  href={`mailto:${productora.email}`}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl transition-all hover:scale-105 text-neutral-300 hover:text-white flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>{productora.email}</span>
                </a>
              )}

              {productora.instagram && (
                <a 
                  id="contact-instagram"
                  href={productora.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl transition-all hover:scale-105 text-neutral-300 hover:text-white flex items-center gap-2 text-sm font-medium"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
              )}

              {productora.whatsapp && (
                <a 
                  id="contact-whatsapp"
                  href={`https://wa.me/${productora.whatsapp.replace(/\+/g, '').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl transition-all hover:scale-105 text-neutral-300 hover:text-white flex items-center gap-2 text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Sección de Eventos */}
        <section id="producer-events" className="space-y-6">
          <div className="border-b border-neutral-900 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Próximos Eventos</h2>
            <p className="text-neutral-400 text-sm mt-1">
              Cartelera de shows y experiencias programadas por esta productora.
            </p>
          </div>

          {!eventos || eventos.length === 0 ? (
            <div id="no-events-state" className="bg-neutral-950 border border-neutral-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Sin eventos programados</h3>
              <p className="text-neutral-500 text-sm max-w-sm">
                Esta productora no tiene eventos publicados actualmente. ¡Por favor, vuelve más tarde!
              </p>
            </div>
          ) : (
            <div id="events-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => {
                const fecha = evento.fecha_evento 
                  ? new Date(evento.fecha_evento).toLocaleDateString('es-ES', {
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })
                  : 'Fecha por confirmar'

                return (
                  <article 
                    key={evento.id} 
                    className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col hover:border-neutral-700 transition-all duration-300 hover:translate-y-[-4px]"
                  >
                    {/* Flyer Imagen Container */}
                    <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
                      {evento.flyer_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={evento.flyer_url} 
                          alt={`Flyer de ${evento.nombre}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <Building className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-neutral-800">
                        ${evento.precio_general}
                      </div>
                    </div>

                    {/* Detalle del Evento */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {evento.nombre}
                        </h3>
                        <p className="text-neutral-400 text-xs flex items-center gap-1.5 capitalized">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="capitalize">{fecha}</span>
                        </p>
                        {evento.descripcion && (
                          <p className="text-neutral-500 text-xs line-clamp-2 pt-1">
                            {evento.descripcion}
                          </p>
                        )}
                      </div>

                      <div>
                        <Link 
                          id={`view-event-${evento.slug}`}
                          href={`/evento/${evento.slug}`}
                          className="w-full py-2 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 group-hover:bg-white group-hover:text-black group-hover:border-white"
                        >
                          <span>Ver Evento</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-20 py-8 bg-neutral-950/30 text-center text-neutral-600 text-xs">
        <p>© {new Date().getFullYear()} Ticketera. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
