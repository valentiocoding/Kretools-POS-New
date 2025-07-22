// supabase/functions/hello-world/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({ code: 401, message: "Missing authorization header" }),
      { status: 401 }
    );
  }

  return new Response("Hello from Supabase Function 👋");
});
