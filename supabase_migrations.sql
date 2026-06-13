-- Crear tabla productoras
CREATE TABLE IF NOT EXISTS public.productoras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla eventos
CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productora_id UUID REFERENCES public.productoras(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_evento TIMESTAMP WITH TIME ZONE,
    precio_general NUMERIC NOT NULL,
    flyer_url TEXT,
    video_url TEXT,
    theme JSONB DEFAULT '{"primaryColor": "#ffffff", "secondaryColor": "#888888", "backgroundColor": "black"}'::jsonb,
    estado TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla artistas
CREATE TABLE IF NOT EXISTS public.artistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    imagen_url TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Modificar tabla tickets para soportar multi-tenant
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE;

-- (Opcional) Políticas de seguridad RLS básicas
ALTER TABLE public.productoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos visibles para todos" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "Artistas visibles para todos" ON public.artistas FOR SELECT USING (true);

-- Insertar datos semilla (Fiesta Pagana original)
DO $$
DECLARE
  prod_id UUID;
  evt_id UUID;
BEGIN
  -- Insertamos una productora por defecto
  INSERT INTO public.productoras (nombre, email) 
  VALUES ('Productora Demo', 'demo@productora.com')
  RETURNING id INTO prod_id;

  -- Insertamos el evento Fiesta Pagana
  INSERT INTO public.eventos (productora_id, nombre, slug, descripcion, fecha_evento, precio_general, theme, estado)
  VALUES (
    prod_id, 
    'FIESTA PAGANA', 
    'fiesta-pagana', 
    'El misterio de lo pagano reside en el desarrollo de la obra de tres artistas principales.', 
    '2026-11-15 23:00:00+00', 
    5000, 
    '{"primaryColor": "#ffffff", "secondaryColor": "#888888", "backgroundColor": "black", "textColor": "text-white"}'::jsonb,
    'published'
  ) RETURNING id INTO evt_id;

  -- Insertamos los artistas hardcodeados previamente
  INSERT INTO public.artistas (evento_id, nombre, orden) VALUES
  (evt_id, 'Ninio Ancestral & Los Barones del Conurbano', 1),
  (evt_id, 'Gugú Petite-Mort', 2),
  (evt_id, 'Materio Primo', 3);

END $$;
