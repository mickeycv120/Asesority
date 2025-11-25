import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file'
  )
}

// Validar que no sean valores placeholder
const placeholderPatterns = [
  'your-project-url',
  'your-anon-key',
  'tu-url-del-proyecto',
  'tu-clave-anon',
  'your-url',
  'your-key'
]

const isPlaceholder = (value: string) => 
  placeholderPatterns.some(pattern => value.includes(pattern))

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  throw new Error(
    'Please configure your Supabase credentials in .env file. Replace the placeholder values with your actual Supabase project URL and anon key.\n' +
    'Get your credentials from: https://supabase.com/dashboard -> Settings -> API'
  )
}

// Validar que la URL sea válida
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(
    `Invalid Supabase URL: "${supabaseUrl}". Must be a valid HTTP or HTTPS URL. Please check your NEXT_PUBLIC_SUPABASE_URL in .env file`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

