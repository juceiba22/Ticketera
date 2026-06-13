import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase';
import CheckoutForm from '@/components/CheckoutForm';

export const dynamic = 'force-dynamic';

interface EventoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventoPage({ params }: EventoPageProps) {
  const { slug } = await params;

  const { data: evento, error } = await supabaseServer
    .from('eventos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !evento) {
    notFound();
  }

  const { data: artistas } = await supabaseServer
    .from('artistas')
    .select('*')
    .eq('evento_id', evento.id)
    .order('orden', { ascending: true });

  const theme = evento.theme || { primaryColor: '#ffffff', secondaryColor: '#888888', backgroundColor: 'black' };
  
  // Format date
  let fechaFormateada = "";
  if (evento.fecha_evento) {
    const fecha = new Date(evento.fecha_evento);
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    fechaFormateada = `${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  }

  return (
    <main 
      className="relative flex flex-col items-center justify-center min-h-screen text-white p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background Video / Image / Gradient */}
      {evento.video_url ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none opacity-40"
        >
          <source src={evento.video_url} type="video/mp4" />
        </video>
      ) : evento.flyer_url ? (
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${evento.flyer_url})` }}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black pointer-events-none" />
      )}

      {/* Artists Layout */}
      <div className="lg:absolute lg:left-12 lg:top-1/2 lg:-translate-y-1/2 mt-16 lg:mt-0 order-2 lg:order-none text-center lg:text-left w-full lg:w-auto animate-fade-in z-10">
        <div className="space-y-6 max-w-sm mx-auto lg:mx-0">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-300">
            {evento.descripcion || 'Conoce el line-up que tenemos preparado para ti.'}
          </h2>
          <div className="w-12 h-px mx-auto lg:mx-0" style={{ backgroundColor: theme.secondaryColor }}></div>
          <ul className="space-y-4">
            {artistas?.map((artista, index) => (
              <li key={artista.id} className="text-lg md:text-xl font-light hover:text-white transition-colors duration-300" style={{ color: theme.secondaryColor }}>
                <span className="text-sm font-medium mr-3" style={{ color: theme.primaryColor }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {artista.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-20 max-w-md w-full text-center space-y-8 animate-fade-in order-1 lg:order-none bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-neutral-900 shadow-2xl">
        <div className="space-y-2">
          <h1 
            className="text-5xl font-extrabold tracking-tighter sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 uppercase"
            style={{ backgroundImage: `linear-gradient(to bottom right, ${theme.primaryColor}, ${theme.secondaryColor})` }}
          >
            {evento.nombre}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-light tracking-widest uppercase">
            {fechaFormateada ? `${fechaFormateada} | ` : ''}Secret Location
          </p>
        </div>

        <CheckoutForm eventoId={evento.id} eventoSlug={evento.slug} theme={theme} />
      </div>
    </main>
  );
}
