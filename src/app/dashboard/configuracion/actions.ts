'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateBranding(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const logo_url = formData.get('logo_url') as string
  const instagram = formData.get('instagram') as string
  const whatsapp = formData.get('whatsapp') as string
  const email = formData.get('email') as string
  const nombre = formData.get('nombre') as string

  const { error } = await supabase
    .from('productoras')
    .update({
      logo_url,
      instagram,
      whatsapp,
      email,
      nombre
    })
    .eq('auth_user_id', user.id)

  if (error) {
    console.error(error)
    redirect('/dashboard/configuracion?error=true')
  }

  revalidatePath('/dashboard/configuracion')
  revalidatePath('/dashboard/layout')
  redirect('/dashboard/configuracion?success=true')
}
