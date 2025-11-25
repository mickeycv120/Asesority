# Estructura de Base de Datos - Ascesority

## 📋 Resumen

Este esquema define la estructura de base de datos para la aplicación Ascesority, una plataforma de asesorías para estudiantes.

## 🗄️ Tablas Principales

### 1. `profiles` (Perfiles de Usuario)

Extiende la información de `auth.users` de Supabase con datos adicionales del perfil.

**Campos:**
- `id` (UUID): Referencia a `auth.users(id)` - PRIMARY KEY
- `email` (TEXT): Email del usuario
- `full_name` (TEXT): Nombre completo
- `avatar_url` (TEXT): URL de la imagen de perfil
- `role` (TEXT): Rol del usuario - `'student'`, `'advisor'`, o `'admin'` (default: `'student'`)
- `phone` (TEXT): Teléfono de contacto
- `bio` (TEXT): Biografía/descripción del usuario
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### 2. `advisor_sessions` (Sesiones de Asesoría) - Opcional

Almacena las sesiones de asesoría entre estudiantes y asesores.

**Campos:**
- `id` (UUID): ID único de la sesión
- `student_id` (UUID): Referencia al estudiante
- `advisor_id` (UUID): Referencia al asesor
- `subject` (TEXT): Materia/asunto de la asesoría
- `description` (TEXT): Descripción detallada
- `scheduled_at` (TIMESTAMP): Fecha y hora programada
- `duration_minutes` (INTEGER): Duración en minutos (default: 60)
- `status` (TEXT): Estado - `'scheduled'`, `'completed'`, `'cancelled'`
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

## 🔒 Seguridad (RLS - Row Level Security)

Todas las tablas tienen RLS habilitado con las siguientes políticas:

### Profiles:
- ✅ Usuarios pueden ver su propio perfil
- ✅ Usuarios pueden actualizar su propio perfil
- ✅ Usuarios pueden insertar su propio perfil

### Advisor Sessions:
- ✅ Usuarios pueden ver sesiones donde son estudiante o asesor
- ✅ Estudiantes pueden crear sesiones
- ✅ Asesores pueden actualizar sesiones

## ⚙️ Triggers Automáticos

1. **`handle_new_user`**: Crea automáticamente un perfil cuando se registra un nuevo usuario
2. **`update_profiles_updated_at`**: Actualiza automáticamente el campo `updated_at` al modificar un perfil

## 📝 Cómo Usar

### 1. Ejecutar el esquema en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `schema.sql`
4. Ejecuta el script

### 2. Verificar que todo funciona

```sql
-- Verificar que la tabla profiles existe
SELECT * FROM public.profiles;

-- Verificar las políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## 🔧 Funciones Útiles

### `get_user_profile()`

Obtiene el perfil completo del usuario actual autenticado.

```sql
SELECT * FROM public.get_user_profile();
```

## 📚 Ejemplos de Uso en el Código

### Obtener perfil del usuario actual

```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .single()
```

### Actualizar perfil

```typescript
const { error } = await supabase
  .from('profiles')
  .update({ 
    full_name: 'Juan Pérez',
    phone: '+1234567890'
  })
  .eq('id', user.id)
```

### Crear sesión de asesoría

```typescript
const { data, error } = await supabase
  .from('advisor_sessions')
  .insert({
    student_id: user.id,
    advisor_id: advisorId,
    subject: 'Matemáticas',
    scheduled_at: '2024-01-15T10:00:00Z'
  })
```

## 🎯 Roles de Usuario

- **student**: Usuario estudiante (por defecto)
- **advisor**: Usuario asesor/profesor
- **admin**: Administrador del sistema

## 📌 Notas Importantes

1. La tabla `auth.users` es manejada automáticamente por Supabase
2. El trigger `handle_new_user` crea automáticamente un perfil cuando se registra un usuario
3. Todos los campos de `profiles` son opcionales excepto `id`
4. El campo `role` tiene un valor por defecto de `'student'`

