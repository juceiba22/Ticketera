'use client'

import FileUploader from '@/components/ui/FileUploader'
import { useState } from 'react'

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <input name="nombre" type="text" required defaultValue={productora.nombre} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email de Contacto</label>
            <input name="email" type="email" required defaultValue={productora.email} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Instagram URL</label>
            <input name="instagram" type="url" placeholder="https://instagram.com/tuproductora" defaultValue={productora.instagram || ''} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">WhatsApp (Número con código de país)</label>
            <input name="whatsapp" type="text" placeholder="+5491100000000" defaultValue={productora.whatsapp || ''} className="w-full px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 text-white" />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-neutral-800">
        <button type="submit" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}
