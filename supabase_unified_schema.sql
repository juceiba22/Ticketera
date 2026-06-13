-- ==========================================
-- SPRINT 1: ARQUITECTURA MULTI-TENANT BASE
-- ==========================================

-- 1. Crear tabla productoras
CREATE TABLE IF NOT EXISTS public.productoras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla eventos
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

-- 3. Crear tabla artistas
CREATE TABLE IF NOT EXISTS public.artistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    imagen_url TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Modificar tabla tickets para soportar multi-tenant
-- (Si la tabla tickets no existe, debes crearla primero. Asumiendo que existe por el código anterior)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_comprador TEXT NOT NULL,
    email_comprador TEXT NOT NULL,
    estado_pago TEXT NOT NULL,
    monto NUMERIC NOT NULL,
    mercadopago_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE;


-- ==========================================
-- SPRINT 2: AUTH & ROW LEVEL SECURITY (RLS)
-- ==========================================

-- 5. Agregar columna auth_user_id a productoras
ALTER TABLE public.productoras
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- (Opcional) Hacer auth_user_id único
ALTER TABLE public.productoras DROP CONSTRAINT IF EXISTS productoras_auth_user_id_key;
ALTER TABLE public.productoras ADD CONSTRAINT productoras_auth_user_id_key UNIQUE (auth_user_id);

-- 6. Trigger para crear automáticamente el registro de productora al confirmar registro
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.productoras (auth_user_id, email, nombre)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'nombre', 'Productora'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Habilitar RLS en tablas
ALTER TABLE public.productoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- LIMPIAR POLÍTICAS ANTERIORES PARA EVITAR CONFLICTOS
DROP POLICY IF EXISTS "Eventos visibles para todos" ON public.eventos;
DROP POLICY IF EXISTS "Artistas visibles para todos" ON public.artistas;
DROP POLICY IF EXISTS "Productoras pueden ver su propio registro" ON public.productoras;
DROP POLICY IF EXISTS "Productoras pueden editar su propio registro" ON public.productoras;
DROP POLICY IF EXISTS "Eventos públicos para lectura" ON public.eventos;
DROP POLICY IF EXISTS "Productora gestiona sus propios eventos (Insert)" ON public.eventos;
DROP POLICY IF EXISTS "Productora gestiona sus propios eventos (Update)" ON public.eventos;
DROP POLICY IF EXISTS "Productora gestiona sus propios eventos (Delete)" ON public.eventos;
DROP POLICY IF EXISTS "Artistas públicos para lectura" ON public.artistas;
DROP POLICY IF EXISTS "Productora gestiona artistas de sus eventos (Insert)" ON public.artistas;
DROP POLICY IF EXISTS "Productora gestiona artistas de sus eventos (Update)" ON public.artistas;
DROP POLICY IF EXISTS "Productora gestiona artistas de sus eventos (Delete)" ON public.artistas;
DROP POLICY IF EXISTS "Productora puede ver tickets de sus eventos" ON public.tickets;


-- 8. Políticas para Productoras (cada productora ve su propio registro)
CREATE POLICY "Productoras pueden ver su propio registro" ON public.productoras
  FOR SELECT USING (auth.uid() = auth_user_id);
  
CREATE POLICY "Productoras pueden editar su propio registro" ON public.productoras
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 9. Políticas para Eventos
CREATE POLICY "Eventos públicos para lectura" ON public.eventos FOR SELECT USING (true);

CREATE POLICY "Productora gestiona sus propios eventos (Insert)" ON public.eventos
  FOR INSERT WITH CHECK (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

CREATE POLICY "Productora gestiona sus propios eventos (Update)" ON public.eventos
  FOR UPDATE USING (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

CREATE POLICY "Productora gestiona sus propios eventos (Delete)" ON public.eventos
  FOR DELETE USING (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

-- 10. Políticas para Artistas
CREATE POLICY "Artistas públicos para lectura" ON public.artistas FOR SELECT USING (true);

CREATE POLICY "Productora gestiona artistas de sus eventos (Insert)" ON public.artistas
  FOR INSERT WITH CHECK (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Productora gestiona artistas de sus eventos (Update)" ON public.artistas
  FOR UPDATE USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Productora gestiona artistas de sus eventos (Delete)" ON public.artistas
  FOR DELETE USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- 11. Políticas para Tickets (lectura de ventas)
CREATE POLICY "Productora puede ver tickets de sus eventos" ON public.tickets
  FOR SELECT USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Insertar datos semilla de prueba (Opcional, omitido si ya existen)
-- DO $$ ... END $$;
