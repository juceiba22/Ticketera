'use client'

import FileUploader from '@/components/ui/FileUploader'
import { useState } from 'react'
import { Building, Mail, MessageCircle, ExternalLink } from 'lucide-react'
import { updateBranding } from './actions'

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


type Productora = {
  id: string
  logo_url?: string
  nombre?: string
  email?: string
  instagram?: string
  whatsapp?: string
}

export default function BrandingForm({ productora }: { productora: Productora }) {
  const [logoUrl, setLogoUrl] = useState(productora.logo_url || '')
  const [nombre, setNombre] = useState(productora.nombre || '')
  const [email, setEmail] = useState(productora.email || '')
  const [instagram, setInstagram] = useState(productora.instagram || '')
  const [whatsapp, setWhatsapp] = useState(productora.whatsapp || '')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Formulario de Configuración */}
      <form action={updateBranding} className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Editar Información</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Logo Comercial</label>
            <FileUploader
              bucket="productoras"
              folder={productora.id}
              accept="image/png, image/jpeg, image/webp"
              maxSizeMB={5}
              currentUrl={logoUrl}
              onUploadSuccess={setLogoUrl}
            />
            <input type="hidden" name="logo_url" value={logoUrl} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Nombre Comercial</label>
              <input 
                name="nombre" 
                type="text" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Email de Contacto</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Instagram URL</label>
              <input 
                name="instagram" 
                type="url" 
                placeholder="https://instagram.com/tuproductora" 
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">WhatsApp (Número con código de país)</label>
              <input 
                name="whatsapp" 
                type="text" 
                placeholder="+5491100000000" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" 
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-800">
          <button type="submit" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
            Guardar Configuración
          </button>
        </div>
      </form>

      {/* Vista Previa del Perfil */}
      <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">Vista Previa del Perfil</h3>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col items-center text-center p-6 relative">
          {/* Banner de fondo decorativo */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-80" />
          
          {/* Contenedor del Logo */}
          <div className="relative mt-8 mb-4 z-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neutral-900 bg-neutral-950 flex items-center justify-center shadow-lg">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building className="w-10 h-10 text-neutral-600 animate-pulse" />
              )}
            </div>
          </div>

          {/* Información */}
          <div className="space-y-2 z-10 w-full">
            <h4 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
              {nombre || 'Nombre de tu Productora'}
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full text-[10px] font-bold" title="Productora Verificada">✓</span>
            </h4>

            <p className="text-sm text-neutral-400 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>{email || 'contacto@tuproductora.com'}</span>
            </p>

            {/* Redes Sociales y Chat */}
            <div className="flex justify-center gap-3 pt-4">
              {instagram ? (
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all hover:scale-105 text-neutral-300 hover:text-white flex items-center gap-2 text-xs font-medium"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
              ) : (
                <div className="px-4 py-2 bg-neutral-950/40 border border-neutral-850 rounded-xl text-neutral-600 flex items-center gap-2 text-xs select-none">
                  <InstagramIcon className="w-4 h-4 text-neutral-700" />
                  <span>Instagram</span>
                </div>
              )}

              {whatsapp ? (
                <a 
                  href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all hover:scale-105 text-neutral-300 hover:text-white flex items-center gap-2 text-xs font-medium"
                >
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span>WhatsApp</span>
                </a>
              ) : (
                <div className="px-4 py-2 bg-neutral-950/40 border border-neutral-850 rounded-xl text-neutral-600 flex items-center gap-2 text-xs select-none">
                  <MessageCircle className="w-4 h-4 text-neutral-700" />
                  <span>WhatsApp</span>
                </div>
              )}
            </div>

            {/* Botón Perfil Público */}
            <div className="pt-6 mt-4 border-t border-neutral-800/60 w-full">
              <a 
                href={`/productora/${productora.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4 text-neutral-400" />
                Ver Perfil Público
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

