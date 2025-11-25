-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA ASCESORITY
-- ============================================

-- 1. TABLA DE PERFILES (extiende auth.users)
-- Esta tabla almacena información adicional del usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'advisor', 'admin')) DEFAULT 'student',
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURIDAD (RLS)
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. TRIGGER para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta después de insertar un usuario en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. TRIGGER para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ÍNDICES para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================
-- TABLAS ADICIONALES (OPCIONALES)
-- ============================================

-- Tabla de sesiones de asesoría (si las necesitas)
CREATE TABLE IF NOT EXISTS public.advisor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.advisor_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para sesiones
CREATE POLICY "Users can view own sessions"
  ON public.advisor_sessions FOR SELECT
  USING (
    auth.uid() = student_id OR 
    auth.uid() = advisor_id
  );

CREATE POLICY "Students can create sessions"
  ON public.advisor_sessions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Advisors can update sessions"
  ON public.advisor_sessions FOR UPDATE
  USING (auth.uid() = advisor_id);

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para obtener el perfil completo del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.role,
    p.phone,
    p.bio,
    p.created_at
  FROM public.profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

