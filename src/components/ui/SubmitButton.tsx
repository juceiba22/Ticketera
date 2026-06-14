'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loadingText?: string
}

export default function SubmitButton({ 
  children, 
  loadingText = 'Guardando...', 
  className, 
  disabled, 
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${className} flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
      {...props}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      <span>{pending ? loadingText : children}</span>
    </button>
  )
}
