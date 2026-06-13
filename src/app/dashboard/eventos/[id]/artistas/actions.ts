'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addArtista(formData: FormData) {
  const supabase = await createClient()

  const evento_id = formData.get('evento_id') as string
  const nombre = formData.get('nombre') as string
  const imagen_url = formData.get('imagen_url') as string
  const orden = Number(formData.get('orden')) || 0

  await supabase.from('artistas').insert({
    evento_id,
    nombre,
    imagen_url,
    orden
  })

  revalidatePath(`/dashboard/eventos/${evento_id}/artistas`)
}

export async function editArtista(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  const nombre = formData.get('nombre') as string
  const imagen_url = formData.get('imagen_url') as string
  const orden = Number(formData.get('orden')) || 0

  await supabase.from('artistas').update({
    nombre,
    imagen_url,
    orden
  }).eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/artistas`)
}

export async function deleteArtista(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string

  await supabase.from('artistas').delete().eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/artistas`)
}
