
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpgqrmfgosszijgzscpt.supabase.co';

/**
 * ⚠️ CRITICAL ERROR DETECTED:
 * The key below starts with 'sb_publishable_...', which is a STRIPE key.
 * Supabase keys ALWAYS start with 'eyJ...'.
 * 
 * TO FIX: 
 * 1. Go to https://app.supabase.com
 * 2. Settings -> API
 * 3. Copy the 'anon' 'public' key
 * 4. Paste it below.
 */
const supabaseAnonKey = 'sb_publishable_DClTUL1TjUydaAvdonCsrQ_3gi9FcH6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
