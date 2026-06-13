import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    payment_id: string;
    external_reference: string;
  }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { data: evento, error } = await supabaseServer
    .from('eventos')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !evento) {
    notFound();
  }

  // Format date
  let fechaFormateada = "";
  if (evento.fecha_evento) {
    const fecha = new Date(evento.fecha_evento);
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    fechaFormateada = `${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  }

  const theme = evento.theme || { primaryColor: '#ffffff', secondaryColor: '#888888', backgroundColor: 'black' };

  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen text-white p-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 
          className="text-4xl font-extrabold tracking-tighter uppercase"
          style={{ backgroundImage: `linear-gradient(to bottom right, ${theme.primaryColor}, ${theme.secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          ¡ENTRADA CONFIRMADA!
        </h1>
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
          <div className="space-y-4 text-left">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Referencia:</span>
              <span className="font-mono">{resolvedSearchParams?.external_reference || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Pago ID:</span>
              <span className="font-mono">{resolvedSearchParams?.payment_id || 'N/A'}</span>
            </div>
          </div>
        </div>
        <p className="font-light text-lg" style={{ color: theme.secondaryColor }}>
          Te enviamos los detalles por email. {fechaFormateada ? `Nos vemos el ${fechaFormateada}.` : 'Nos vemos pronto.'}
        </p>
        <Link 
          href={`/evento/${evento.slug}`} 
          className="inline-block mt-4 px-6 py-3 font-semibold rounded-xl transition-colors"
          style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor || 'black' }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
