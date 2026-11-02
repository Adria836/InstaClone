import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fzasydykqsvrrmubtoxo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YXN5ZHlrcXN2cnJtdWJ0b3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1OTU1MTIsImV4cCI6MjEwOTE3MTUxMn0.oao9oVErLMUFmUc_PlKgZmkgVmk2KspLe0Z7uKj2kio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabase = () => supabase;
