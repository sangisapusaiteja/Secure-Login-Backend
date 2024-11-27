import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and API Key
const supabaseUrl = 'https://socfuzfaipkziwfgtnbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2Z1emZhaXBreml3Zmd0bmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTM3ODAsImV4cCI6MjA0ODI4OTc4MH0.eMMze8XeJoSrsstZJJAMUKVNu-3237Koo4_iooCCEQk';

export const supabase = createClient(supabaseUrl, supabaseKey);
