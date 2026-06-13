'use client'

import { useState } from 'react';

interface CheckoutFormProps {
  eventoId: string;
  eventoSlug: string;
  theme?: any;
}

export default function CheckoutForm({ eventoId, eventoSlug, theme }: CheckoutFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [statusText, setStatusText] = useState('CONTINUAR');
  const [errorMsg, setErrorMsg] = useState('');

  const primaryColor = theme?.primaryColor || '#ffffff';
  const secondaryColor = theme?.secondaryColor || '#888888';
  const textColor = theme?.textColor || 'text-white';
  const buttonClass = `w-full py-4 mt-4 font-semibold tracking-wide text-lg rounded-xl transition-colors disabled:opacity-50`;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nombre) {
      setErrorMsg("Completa todos los campos.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('ENVIANDO CÓDIGO...');

    if (!validateEmail(email)) {
      setErrorMsg("El formato del email es inválido.");
      setLoading(false);
      setStatusText('CONTINUAR');
      return;
    }

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, eventoId })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Hubo un error con tu solicitud.");
        setLoading(false);
        setStatusText('CONTINUAR');
        return;
      }

      const { token } = data;
      setOtpToken(token);
      setStep(2);
      setStatusText('VALIDAR CÓDIGO');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error enviando código.");
      setLoading(false);
      setStatusText('CONTINUAR');
    }
  };

  const handleVerifyAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("Ingresa un código válido de 6 dígitos.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('VALIDANDO...');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, token: otpToken, code: otpCode, eventoId })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Código incorrecto.");
        setLoading(false);
        setStatusText('VALIDAR CÓDIGO');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Error contactando a Mercado Pago.");
        setLoading(false);
        setStatusText('VALIDAR CÓDIGO');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error procesando validación.");
      setLoading(false);
      setStatusText('VALIDAR CÓDIGO');
    }
  };

  return (
    <>
      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4 pt-6 w-full">
          <input
            type="text"
            required
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light placeholder:text-neutral-600"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Introduce tu e-mail"
            className="w-full px-4 py-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 transition-all font-light placeholder:text-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorMsg && (
            <p className="text-red-500 text-sm font-medium animate-fade-in text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={buttonClass}
            style={{ backgroundColor: primaryColor, color: theme?.backgroundColor || 'black' }}
          >
            {statusText}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndCheckout} className="space-y-4 pt-6 animate-fade-in w-full">
          <h2 className="text-2xl font-bold mb-2">Valida tu Email</h2>
          <p className="text-neutral-400 text-sm mb-6">Hemos enviado un código de 6 dígitos a <br/><span className="text-white font-medium">{email}</span></p>
          <input
            type="text"
            required
            placeholder="Código de 6 dígitos"
            maxLength={6}
            className="w-full px-4 py-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 transition-all font-monospace text-center tracking-[0.5em] text-2xl placeholder:text-neutral-600 placeholder:tracking-normal placeholder:text-base"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          />
          {errorMsg && (
            <p className="text-red-500 text-sm font-medium animate-fade-in text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className={buttonClass}
            style={{ backgroundColor: primaryColor, color: theme?.backgroundColor || 'black' }}
          >
            {statusText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { setStep(1); setErrorMsg(''); setStatusText('CONTINUAR'); }}
            className="w-full py-2 mt-2 bg-transparent text-neutral-500 text-sm hover:text-white transition-colors disabled:opacity-50"
          >
            Volver atrás
          </button>
        </form>
      )}
    </>
  );
}
