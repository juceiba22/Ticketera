'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper helper to revalidate event routes
async function revalidateEvent(supabase: any, eventoId: string) {
  try {
    const { data } = await supabase
      .from('eventos')
      .select('slug')
      .eq('id', eventoId)
      .single()
    if (data?.slug) {
      revalidatePath(`/evento/${data.slug}`)
      revalidatePath(`/preview/${data.slug}`)
    }
  } catch (error) {
    console.error('Error in revalidateEvent:', error)
  }
}

export async function updateTheme(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const theme = formData.get('theme') as string

  const { error } = await supabase.from('eventos').update({
    theme: { name: theme }
  }).eq('id', id)

  if (error) {
    console.error('Error updating theme:', error)
  }

  await revalidateEvent(supabase, id)
  revalidatePath(`/dashboard/eventos/${id}/landing`)
}

export async function addSeccion(formData: FormData) {
  const supabase = await createClient()

  const evento_id = formData.get('evento_id') as string
  const tipo = formData.get('tipo') as string
  const orden = Number(formData.get('orden')) || 0

  // Pre-fill content if section type is "alias"
  const contenido_json = tipo === 'alias'
    ? {
        titulo: 'Transferí a esta cuenta',
        texto: 'Titular de la Cuenta: \nDNI/CUIL: \nCBU/CVU: \nAlias: \nBanco: '
      }
    : {}

  const { error } = await supabase.from('evento_secciones').insert({
    evento_id,
    tipo,
    orden,
    visible: true,
    contenido_json
  })

  if (error) {
    console.error('Error adding section:', error)
  }

  await revalidateEvent(supabase, evento_id)
  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function updateSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  
  const titulo = formData.get('titulo') as string
  const texto = formData.get('texto') as string
  
  const { error } = await supabase.from('evento_secciones').update({
    contenido_json: { titulo, texto }
  }).eq('id', id)

  if (error) {
    console.error('Error updating section:', error)
  }

  await revalidateEvent(supabase, evento_id)
  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function moveSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  const newOrden = Number(formData.get('orden'))

  const { error } = await supabase.from('evento_secciones').update({
    orden: newOrden
  }).eq('id', id)

  if (error) {
    console.error('Error moving section:', error)
  }

  await revalidateEvent(supabase, evento_id)
  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function toggleSeccionVisibility(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string
  const visible = formData.get('visible') === 'true'

  const { error } = await supabase.from('evento_secciones').update({
    visible: !visible
  }).eq('id', id)

  if (error) {
    console.error('Error toggling visibility:', error)
  }

  await revalidateEvent(supabase, evento_id)
  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}

export async function deleteSeccion(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const evento_id = formData.get('evento_id') as string

  const { error } = await supabase.from('evento_secciones').delete().eq('id', id)

  if (error) {
    console.error('Error deleting section:', error)
  }

  await revalidateEvent(supabase, evento_id)
  revalidatePath(`/dashboard/eventos/${evento_id}/landing`)
}
