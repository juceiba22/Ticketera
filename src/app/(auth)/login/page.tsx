import { login } from '../actions'
import Link from 'next/link'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form className="max-w-sm w-full bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Iniciar Sesión</h1>
          <p className="text-neutral-400 mt-2 text-sm">Ingresa a tu portal de productora</p>
        </div>

        {searchParams?.error && (
          <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm text-center">
            Credenciales incorrectas.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1" htmlFor="password">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-neutral-950 rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light"
            />
          </div>
        </div>

        <button formAction={login} className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
          Ingresar
        </button>

        <p className="text-center text-sm text-neutral-500 mt-4">
          ¿No tienes cuenta? <Link href="/register" className="text-white hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  )
}
