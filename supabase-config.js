// ============================================================
//  SUPABASE CONFIGURATION
//  Replace the values below with your own Supabase project details.
//  Find them at: https://supabase.com/dashboard → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://khyjbpuqckxbqubjxatk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1E-lKzHGtVRolPiBCVqmLQ_sPj-jVes';
// Initialise the Supabase client (available globally as `supabase`)
const { createClient } = supabase;
window._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
