-- ==========================================
-- SPRINT 3: STORAGE, BRANDING & VISUAL BUILDER
-- ==========================================

-- 1. Agregar campos de Branding a Productoras
ALTER TABLE public.productoras
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 2. Crear tabla evento_secciones para el Landing Builder
CREATE TABLE IF NOT EXISTS public.evento_secciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- hero, lineup, tickets, galeria, sponsors, faq, contacto
    orden INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    contenido_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.evento_secciones ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para evento_secciones
CREATE POLICY "Secciones públicas para lectura" ON public.evento_secciones FOR SELECT USING (true);

CREATE POLICY "Productora gestiona secciones de sus eventos (Insert)" ON public.evento_secciones
  FOR INSERT WITH CHECK (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Productora gestiona secciones de sus eventos (Update)" ON public.evento_secciones
  FOR UPDATE USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Productora gestiona secciones de sus eventos (Delete)" ON public.evento_secciones
  FOR DELETE USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- 4. Creación de Buckets en Storage (Solo funcionará si se corre con un ROL adecuado de Supabase)
-- NOTA: Si esto falla por falta de permisos, se deben crear los buckets manualmente en el panel de Supabase:
-- Buckets: 'eventos-flyers', 'eventos-videos', 'artistas', 'productoras' (todos marcados como "Public")

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('eventos-flyers', 'eventos-flyers', true),
  ('eventos-videos', 'eventos-videos', true),
  ('artistas', 'artistas', true),
  ('productoras', 'productoras', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de Storage
-- Flyers
CREATE POLICY "Public Access Flyers" ON storage.objects FOR SELECT USING (bucket_id = 'eventos-flyers');
CREATE POLICY "Auth Insert Flyers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'eventos-flyers');
CREATE POLICY "Auth Delete Flyers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'eventos-flyers');

-- Videos
CREATE POLICY "Public Access Videos" ON storage.objects FOR SELECT USING (bucket_id = 'eventos-videos');
CREATE POLICY "Auth Insert Videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'eventos-videos');
CREATE POLICY "Auth Delete Videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'eventos-videos');

-- Artistas
CREATE POLICY "Public Access Artistas" ON storage.objects FOR SELECT USING (bucket_id = 'artistas');
CREATE POLICY "Auth Insert Artistas" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artistas');
CREATE POLICY "Auth Delete Artistas" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'artistas');

-- Productoras
CREATE POLICY "Public Access Productoras" ON storage.objects FOR SELECT USING (bucket_id = 'productoras');
CREATE POLICY "Auth Insert Productoras" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'productoras');
CREATE POLICY "Auth Delete Productoras" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'productoras');
