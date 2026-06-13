'use client'

import FileUploader from '@/components/ui/FileUploader'
import { useState } from 'react'

export default function ArtistImageUploader({ defaultUrl = '' }) {
  const [url, setUrl] = useState(defaultUrl)

  return (
    <div className="w-full">
      <FileUploader
        bucket="artistas"
        accept="image/png, image/jpeg, image/webp"
        maxSizeMB={5}
        currentUrl={url}
        onUploadSuccess={setUrl}
      />
      <input type="hidden" name="imagen_url" value={url} />
    </div>
  )
}
