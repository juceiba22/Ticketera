'use client'

import FileUploader from '@/components/ui/FileUploader'
import { useState } from 'react'

export default function EventUploaderFields({ defaultFlyer = '', defaultVideo = '' }) {
  const [flyer, setFlyer] = useState(defaultFlyer)
  const [video, setVideo] = useState(defaultVideo)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Flyer del Evento</label>
        <FileUploader
          bucket="eventos-flyers"
          accept="image/png, image/jpeg, image/webp"
          maxSizeMB={10}
          currentUrl={flyer}
          onUploadSuccess={setFlyer}
        />
        <input type="hidden" name="flyer" value={flyer} />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Video de Fondo</label>
        <FileUploader
          bucket="eventos-videos"
          accept="video/mp4"
          maxSizeMB={100}
          currentUrl={video}
          onUploadSuccess={setVideo}
        />
        <input type="hidden" name="video" value={video} />
      </div>
    </div>
  )
}
