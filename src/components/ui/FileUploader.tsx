'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2, Image as ImageIcon, Video } from 'lucide-react'

interface FileUploaderProps {
  bucket: string
  folder?: string
  accept?: string
  maxSizeMB?: number
  onUploadSuccess: (url: string) => void
  currentUrl?: string
}

export default function FileUploader({ 
  bucket, 
  folder = '', 
  accept = 'image/*', 
  maxSizeMB = 10,
  onUploadSuccess,
  currentUrl
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera el tamaño máximo permitido de ${maxSizeMB}MB`)
      return
    }

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      onUploadSuccess(publicUrlData.publicUrl)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ocurrió un error al subir el archivo.')
    } finally {
      setIsUploading(false)
    }
  }

  const isVideo = currentUrl?.match(/\.(mp4|webm|ogg)$/i) || accept.includes('video')

  return (
    <div className="space-y-4">
      {currentUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video flex items-center justify-center">
          {isVideo ? (
            <video src={currentUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
              Cambiar Archivo
              <input type="file" accept={accept} className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          error ? 'border-red-500/50 bg-red-900/10' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900/50 hover:bg-neutral-900'
        }`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mb-2" />
            ) : isVideo ? (
              <Video className="w-8 h-8 text-neutral-400 mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
            )}
            <p className="text-sm text-neutral-400">
              {isUploading ? 'Subiendo...' : 'Click para seleccionar archivo'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Máx {maxSizeMB}MB</p>
          </div>
          <input type="file" accept={accept} className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
