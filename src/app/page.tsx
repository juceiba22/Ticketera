
'use client'

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [statusText, setStatusText] = useState('CONTINUAR');
  const [errorMsg, setErrorMsg] = useState('');

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
        body: JSON.stringify({ email })
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
        body: JSON.stringify({ nombre, email, token: otpToken, code: otpCode })
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
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black pointer-events-none" />

      {/* Artists & Concept Layout */}
      {/* Desktop: Fixed to left, mobile: displayed below the form */}
      <div className="lg:absolute lg:left-12 lg:top-1/2 lg:-translate-y-1/2 mt-16 lg:mt-0 order-2 lg:order-none text-center lg:text-left w-full lg:w-auto animate-fade-in z-10">
        <div className="space-y-6 max-w-sm mx-auto lg:mx-0">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-300">
            El misterio no se oculta,<br className="hidden lg:block"/> <span className="font-medium text-white italic">se desarrolla.</span>
          </h2>
          <div className="w-12 h-px bg-neutral-800 mx-auto lg:mx-0"></div>
          <ul className="space-y-4">
            <li className="text-lg md:text-xl font-light text-neutral-400 hover:text-white transition-colors duration-300">
              Ninio Ancestral &<br className="hidden lg:block"/> Los Barones del Conurbano
            </li>
            <li className="text-lg md:text-xl font-light text-neutral-400 hover:text-white transition-colors duration-300">
              Gugú Petite-Mort
            </li>
            <li className="text-lg md:text-xl font-light text-neutral-400 hover:text-white transition-colors duration-300">
              Materio Primo
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-20 max-w-md w-full text-center space-y-8 animate-fade-in order-1 lg:order-none bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-neutral-900 shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500">
            FIESTA PAGANA
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-light tracking-widest uppercase">
            15 Noviembre | Secret Location
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4 pt-6">
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
              className="w-full px-4 py-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light placeholder:text-neutral-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMsg && (
              <p className="text-red-500 text-sm font-medium animate-fade-in text-center">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-white text-black font-semibold tracking-wide text-lg rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {statusText}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndCheckout} className="space-y-4 pt-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Valida tu Email</h2>
            <p className="text-neutral-400 text-sm mb-6">Hemos enviado un código de 6 dígitos a <br/><span className="text-white font-medium">{email}</span></p>
            <input
              type="text"
              required
              placeholder="Código de 6 dígitos"
              maxLength={6}
              className="w-full px-4 py-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-monospace text-center tracking-[0.5em] text-2xl placeholder:text-neutral-600 placeholder:tracking-normal placeholder:text-base"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            />
            {errorMsg && (
              <p className="text-red-500 text-sm font-medium animate-fade-in text-center">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-4 mt-4 bg-white text-black font-semibold tracking-wide text-lg rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
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
      </div>
    </main>
  );
}
