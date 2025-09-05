import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rityyvbqdlpfussbtkcl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdHl5dmJxZGxwZnVzc2J0a2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4Nzg3MDYsImV4cCI6MjA3MjQ1NDcwNn0.H6nkERzQW2RbxeW20l42a2OYhiSE81xsbgLSk03Vb0A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, 
    },
  },
});
