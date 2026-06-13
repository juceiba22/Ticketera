'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTheme(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const theme = formData.get('theme') as string

  // We are currently storing `theme` as JSONB. In Sprint 3, the user wants theme to be a string name: 'dark', 'rock', etc.
  // Wait, if it's JSONB, maybe I should just store it as a string inside the json object, or change the schema.
  // We can just store `{"name": "rock"}` in the existing `theme` jsonb column to avoid dropping the column.
  
  await supabase.from('eventos').update({
    theme: { name: theme }
  }).eq('id', id)

  revalidatePath(`/dashboard/eventos/${id}/landing`)
}

export async function addSeccion(formData: FormData) {
  const supabase = await createClient()

  const evento_id = formData.get('evento_id') as string
  const tipo = formData.get('tipo') as string
  const orden = Number(formData.get('orden')) || 0

  await supabase.from('evento_secciones').insert({
    evento_id,
    tipo,
    orden,
    visible: true,
    contenido_json: {}
  })

  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function updateSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  
  const titulo = formData.get('titulo') as string
  const texto = formData.get('texto') as string
  
  await supabase.from('evento_secciones').update({
    contenido_json: { titulo, texto }
  }).eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function moveSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  const newOrden = Number(formData.get('orden'))

  await supabase.from('evento_secciones').update({
    orden: newOrden
  }).eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function toggleSeccionVisibility(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  const visible = formData.get('visible') === 'true'

  await supabase.from('evento_secciones').update({
    visible: !visible
  }).eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function deleteSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string

  await supabase.from('evento_secciones').delete().eq('id', id)

  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}
