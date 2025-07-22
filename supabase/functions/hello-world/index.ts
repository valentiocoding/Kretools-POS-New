// supabase/functions/hello-world/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Ambil dari environment Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ code: 401, message: "Missing or invalid authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  // Verifikasi token dengan Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response(
      JSON.stringify({ code: 401, message: "Unauthorized: invalid or expired token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Hello ${user.email}, this is a protected Edge Function!`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
