// ============================================================
//  SUPABASE CONFIGURATION
//  Replace the values below with your own Supabase project details.
//  Find them at: https://supabase.com/dashboard → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';   // ← replace
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';             // ← replace

// Initialise the Supabase client (available globally as `supabase`)
const { createClient } = supabase;
window._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
