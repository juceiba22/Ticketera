import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute w-12 h-12 rounded-full bg-indigo-500/20 blur-md animate-pulse" />
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin relative z-10" />
      </div>
      <p className="text-neutral-400 text-xs tracking-widest uppercase animate-pulse">Cargando panel...</p>
    </div>
  )
}
