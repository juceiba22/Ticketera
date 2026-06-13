'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createEvento(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: productora } = await supabase
    .from('productoras')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!productora) throw new Error('Productora not found')

  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string
  const descripcion = formData.get('descripcion') as string
  const fecha_evento = formData.get('fecha') as string
  const precio_general = Number(formData.get('precio'))
  const flyer_url = formData.get('flyer') as string
  const video_url = formData.get('video') as string
  const estado = formData.get('estado') as string

  const { data: evento, error } = await supabase
    .from('eventos')
    .insert({
      productora_id: productora.id,
      nombre,
      slug,
      descripcion,
      fecha_evento: fecha_evento ? new Date(fecha_evento).toISOString() : null,
      precio_general,
      flyer_url,
      video_url,
      estado,
      theme: { primaryColor: '#ffffff', secondaryColor: '#888888', backgroundColor: 'black' }
    })
    .select('id')
    .single()

  if (error) {
    console.error(error)
    redirect('/dashboard/eventos/nuevo?error=true')
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/eventos/${evento.id}`)
}

export async function updateEvento(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string
  const descripcion = formData.get('descripcion') as string
  const fecha_evento = formData.get('fecha') as string
  const precio_general = Number(formData.get('precio'))
  const flyer_url = formData.get('flyer') as string
  const video_url = formData.get('video') as string
  const estado = formData.get('estado') as string

  const { error } = await supabase
    .from('eventos')
    .update({
      nombre,
      slug,
      descripcion,
      fecha_evento: fecha_evento ? new Date(fecha_evento).toISOString() : null,
      precio_general,
      flyer_url,
      video_url,
      estado
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    redirect(`/dashboard/eventos/${id}?error=true`)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/eventos/${id}`)
  redirect(`/dashboard/eventos/${id}?success=true`)
}

export async function deleteEvento(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  await supabase.from('eventos').delete().eq('id', id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
