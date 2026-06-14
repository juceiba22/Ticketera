import React from 'react'

type EventoData = {
  id?: string
  nombre?: string
  fecha_evento?: string
  precio_general?: number
  video_url?: string
  flyer_url?: string
  theme?: { name?: string } | null
}

type ArtistaData = {
  id?: string
  nombre?: string
}

type ProductoraData = {
  instagram?: string
  whatsapp?: string
  email?: string
}

type SeccionData = {
  id?: string
  tipo: string
  contenido_json?: {
    titulo?: string
    texto?: string
  }
}

// Common props for all sections
export interface SectionProps {
  evento: EventoData
  artistas?: ArtistaData[]
  productora?: ProductoraData
  seccion: SeccionData
}

// Simple fallback components if a theme doesn't implement a section
const DefaultHero = ({ evento, seccion }: SectionProps) => (
  <div className="relative min-h-[60vh] flex items-center justify-center bg-black text-white text-center p-6">
    {evento.video_url ? (
      <video src={evento.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40" />
    ) : evento.flyer_url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={evento.flyer_url} alt="Flyer" className="absolute inset-0 w-full h-full object-cover opacity-40" />
    ) : null}
    <div className="relative z-10">
      <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">{seccion.contenido_json?.titulo || evento.nombre}</h1>
      {evento.fecha_evento && <p className="mt-4 text-xl">{new Date(evento.fecha_evento).toLocaleDateString()}</p>}
      {seccion.contenido_json?.texto && <p className="mt-4 max-w-xl mx-auto">{seccion.contenido_json.texto}</p>}
    </div>
  </div>
)

const DefaultLineup = ({ artistas, seccion }: SectionProps) => (
  <div className="py-20 bg-neutral-950 text-white text-center px-6">
    <h2 className="text-3xl font-bold mb-10">{seccion.contenido_json?.titulo || 'Line-Up'}</h2>
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {artistas?.map(a => (
        <div key={a.id} className="text-2xl md:text-4xl font-light uppercase tracking-widest">{a.nombre}</div>
      ))}
    </div>
  </div>
)

const DefaultTickets = ({ evento, seccion }: SectionProps) => (
  <div className="py-20 bg-neutral-900 text-white text-center px-6">
    <h2 className="text-3xl font-bold mb-6">{seccion.contenido_json?.titulo || 'Tickets'}</h2>
    <p className="text-2xl mb-8">${evento.precio_general}</p>
    <a href="#comprar" className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
      Comprar Ahora
    </a>
  </div>
)

const DefaultFAQ = ({ seccion }: SectionProps) => (
  <div className="py-20 bg-black text-white px-6">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">{seccion.contenido_json?.titulo || 'FAQ'}</h2>
      <p className="text-neutral-400">{seccion.contenido_json?.texto || 'Preguntas frecuentes...'}</p>
    </div>
  </div>
)

const DefaultContacto = ({ productora, seccion }: SectionProps) => (
  <div className="py-20 bg-neutral-950 text-white px-6 text-center">
    <h2 className="text-3xl font-bold mb-6">{seccion.contenido_json?.titulo || 'Contacto'}</h2>
    {seccion.contenido_json?.texto && <p className="text-neutral-400 mb-6">{seccion.contenido_json.texto}</p>}
    <div className="flex justify-center gap-4">
      {productora?.instagram && <a href={productora.instagram} target="_blank" className="text-white underline">Instagram</a>}
      {productora?.whatsapp && <a href={`https://wa.me/${productora.whatsapp.replace(/\+/g,'')}`} target="_blank" className="text-white underline">WhatsApp</a>}
      {productora?.email && <a href={`mailto:${productora.email}`} className="text-white underline">Email</a>}
    </div>
  </div>
)

const DefaultAlias = ({ seccion }: SectionProps) => (
  <div className="py-20 bg-neutral-900 text-white px-6">
    <div className="max-w-xl mx-auto bg-neutral-950 border border-neutral-850 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <h2 className="text-2xl font-bold mb-6 text-center text-white">{seccion.contenido_json?.titulo || 'Transferí a esta cuenta'}</h2>
      <div className="space-y-4 text-neutral-300 font-light whitespace-pre-line text-center">
        {seccion.contenido_json?.texto || 'Datos de la cuenta...'}
      </div>
    </div>
  </div>
)

// The registry structure
export const THEMES: Record<string, Record<string, React.FC<SectionProps>>> = {
  dark: {
    hero: DefaultHero,
    lineup: DefaultLineup,
    tickets: DefaultTickets,
    faq: DefaultFAQ,
    contacto: DefaultContacto,
    alias: DefaultAlias,
  },
  // In a real app we would import custom components for each theme.
  // For Sprint 3, we will reuse the defaults but with some tailwind overrides if we wanted, 
  // or just copy the defaults into all themes. To avoid huge files, we map them here.
  rock: {
    hero: (props) => <div className="border-b-8 border-red-600 font-serif"><DefaultHero {...props} /></div>,
    lineup: (props) => <div className="bg-red-950"><DefaultLineup {...props} /></div>,
    tickets: DefaultTickets,
    faq: DefaultFAQ,
    contacto: DefaultContacto,
  },
  electronic: {
    hero: (props) => <div className="mix-blend-screen bg-blue-900"><DefaultHero {...props} /></div>,
    lineup: DefaultLineup,
    tickets: DefaultTickets,
    faq: DefaultFAQ,
    contacto: DefaultContacto,
  },
  festival: {
    hero: (props) => <div className="bg-gradient-to-r from-pink-500 to-yellow-500"><DefaultHero {...props} /></div>,
    lineup: DefaultLineup,
    tickets: DefaultTickets,
    faq: DefaultFAQ,
    contacto: DefaultContacto,
  },
  corporate: {
    hero: (props) => <div className="bg-white text-black border-b border-gray-200"><DefaultHero {...props} /></div>,
    lineup: DefaultLineup,
    tickets: DefaultTickets,
    faq: DefaultFAQ,
    contacto: DefaultContacto,
  }
}

export function RenderSection({ themeName, sectionName, props }: { themeName: string, sectionName: string, props: SectionProps }) {
  const theme = THEMES[themeName] || THEMES['dark']
  const Component = theme[sectionName] || THEMES['dark'][sectionName]

  if (!Component) return null

  return <Component {...props} />
}
