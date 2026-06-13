-- 1. Agregar columna auth_user_id a productoras
ALTER TABLE public.productoras
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- (Opcional) Hacer auth_user_id único
ALTER TABLE public.productoras ADD CONSTRAINT productoras_auth_user_id_key UNIQUE (auth_user_id);

-- 2. Trigger para crear automáticamente el registro de productora al confirmar registro
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

-- 3. Habilitar RLS en tablas si no estaban habilitadas
ALTER TABLE public.productoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para Productoras (cada productora ve su propio registro)
CREATE POLICY "Productoras pueden ver su propio registro" ON public.productoras
  FOR SELECT USING (auth.uid() = auth_user_id);
  
CREATE POLICY "Productoras pueden editar su propio registro" ON public.productoras
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 5. Políticas para Eventos
-- Mantenemos acceso de lectura pública para las landings
CREATE POLICY "Eventos públicos para lectura" ON public.eventos FOR SELECT USING (true);

-- Sólo la productora dueña puede insertar/actualizar/eliminar
CREATE POLICY "Productora gestiona sus propios eventos (Insert)" ON public.eventos
  FOR INSERT WITH CHECK (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

CREATE POLICY "Productora gestiona sus propios eventos (Update)" ON public.eventos
  FOR UPDATE USING (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

CREATE POLICY "Productora gestiona sus propios eventos (Delete)" ON public.eventos
  FOR DELETE USING (productora_id IN (SELECT id FROM public.productoras WHERE auth_user_id = auth.uid()));

-- 6. Políticas para Artistas
-- Mantenemos acceso de lectura pública
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

-- 7. Políticas para Tickets (lectura de ventas)
-- Permitir lectura pública (o mediante backend service_role) para las validaciones/checkouts no es problema si el service_role ignora RLS.
-- Si queremos que el dashboard consulte:
CREATE POLICY "Productora puede ver tickets de sus eventos" ON public.tickets
  FOR SELECT USING (
    evento_id IN (
      SELECT e.id FROM public.eventos e
      JOIN public.productoras p ON e.productora_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );
-- Nota: La inserción / update por MercadoPago se hace mediante service_role que hace bypass del RLS.
