'use client'

import { useState, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
  buttonContent: React.ReactNode
}

export default function ConfirmButton({ 
  confirmTitle = '¿Estás seguro?', 
  confirmMessage = 'Esta acción no se puede deshacer.', 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  buttonContent,
  className,
  formAction,
  ...props 
}: ConfirmButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleInitialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsOpen(true)
  }

  const handleConfirm = () => {
    setIsOpen(false)
    // We need to trigger the form submission.
    // If it's a standard form submit button, we can dispatch a submit event or use requestSubmit
    if (buttonRef.current && buttonRef.current.form) {
      // Create a hidden input to pass the formAction if provided, because requestSubmit doesn't pass formaction from the button itself easily if we just call form.requestSubmit()
      // Actually, form.requestSubmit(submitter) allows passing the button that triggered it!
      buttonRef.current.form.requestSubmit(buttonRef.current)
    }
  }

  return (
    <>
      <button 
        type="submit" 
        onClick={handleInitialClick} 
        className={className}
        {...props}
      >
        {buttonContent}
      </button>

      {/* Hidden button used to actually submit the form with the correct formAction if any */}
      <button 
        ref={buttonRef} 
        type="submit" 
        formAction={formAction} 
        className="hidden" 
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">{confirmTitle}</h3>
              <p className="text-neutral-400 mb-8">{confirmMessage}</p>
              
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  {cancelText}
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirm}
                  className="px-5 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
