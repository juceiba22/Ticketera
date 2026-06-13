import { createClient } from '@/utils/supabase/server'
import { updateBranding } from './actions'
import BrandingForm from './BrandingForm'

export const dynamic = 'force-dynamic';

export default async function ConfiguracionPage({ searchParams }: { searchParams: { success?: string, error?: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: productora } = await supabase
    .from('productoras')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Configuración y Branding</h1>
        <p className="text-neutral-400 mt-1">Administra la información pública de tu productora.</p>
      </div>

      {searchParams?.success && (
        <div className="bg-green-900/50 text-green-400 p-4 rounded-xl text-sm">
          Configuración guardada exitosamente.
        </div>
      )}
      {searchParams?.error && (
        <div className="bg-red-900/50 text-red-400 p-4 rounded-xl text-sm">
          Hubo un error al guardar la configuración.
        </div>
      )}

      <form action={updateBranding} className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl">
        <BrandingForm productora={productora} />
      </form>
    </div>
  )
}
