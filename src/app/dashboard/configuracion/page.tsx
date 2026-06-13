import { createClient } from '@/utils/supabase/server'
import BrandingForm from './BrandingForm'

export const dynamic = 'force-dynamic';

export default async function ConfiguracionPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ success?: string, error?: string }> 
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: productora } = await supabase
    .from('productoras')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  const resolvedSearchParams = await searchParams

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Configuración y Branding</h1>
        <p className="text-neutral-400 mt-1">Administra la información pública de tu productora.</p>
      </div>

      {resolvedSearchParams?.success && (
        <div className="bg-green-900/50 text-green-400 p-4 rounded-xl text-sm border border-green-800/30">
          Configuración guardada exitosamente.
        </div>
      )}
      {resolvedSearchParams?.error && (
        <div className="bg-red-900/50 text-red-400 p-4 rounded-xl text-sm border border-red-800/30">
          Hubo un error al guardar la configuración.
        </div>
      )}

      <BrandingForm productora={productora} />
    </div>
  )
}

