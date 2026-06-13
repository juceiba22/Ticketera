import Link from 'next/link'
import { Calendar, Ticket, Zap, ShieldCheck } from 'lucide-react'

export default function PlatformLandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-neutral-800">
        <div className="font-bold text-2xl tracking-tighter">
          TICKETERA
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 font-medium text-neutral-300 hover:text-white transition-colors">
            Ingresar
          </Link>
          <Link href="/register" className="px-4 py-2 font-medium bg-white text-black rounded-full hover:bg-neutral-200 transition-colors">
            Crear Productora
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          La plataforma para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">creadores de eventos</span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto">
          Gestiona tus eventos, artistas, venta de tickets y diseña tu landing page en minutos. Todo desde un único lugar.
        </p>
        <Link href="/register" className="inline-block px-8 py-4 text-lg font-bold bg-white text-black rounded-full hover:bg-neutral-200 transition-transform hover:scale-105">
          Comenzar Gratis
        </Link>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
            <Zap className="w-10 h-10 text-blue-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Constructor Visual</h3>
            <p className="text-neutral-400">Arma la web de tu evento arrastrando módulos y eligiendo themes pre-diseñados.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
            <Ticket className="w-10 h-10 text-purple-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Gestión de Tickets</h3>
            <p className="text-neutral-400">Controla tus ventas, precios y capacidad en tiempo real con integración de pagos.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
            <Calendar className="w-10 h-10 text-pink-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Multi-Evento</h3>
            <p className="text-neutral-400">Administra todos los eventos de tu productora desde un único dashboard centralizado.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-green-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Cloud Storage</h3>
            <p className="text-neutral-400">Sube flyers, videos y fotos de artistas directo a la plataforma de manera segura.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 px-6 text-center text-neutral-500">
        <p>© {new Date().getFullYear()} Ticketera. Todos los derechos reservados.</p>
      </footer>
    </main>
  )
}
