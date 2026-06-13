'use client'

import { Toaster, toast } from 'sonner'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function ToastListener() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success) {
      toast.success(success === 'true' ? 'Operación exitosa' : success)
    }
    if (error) {
      toast.error(error === 'true' ? 'Ocurrió un error' : error)
    }

    if (success || error) {
      // Clean up the URL
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('success')
      newSearchParams.delete('error')
      const newUrl = `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, pathname, router])

  return null
}

export default function ToastProvider() {
  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
    </>
  )
}
