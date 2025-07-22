// src/services/auth.js
import { supabase } from "@/lib/supabaseClient";

export async function loginWithEmail(email, password) {
  return await supabase.auth.signInWithPassword({ email, password,
   });
}

export async function handleLogout(navigate) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return;
  }

  localStorage.removeItem("username");
  navigate("/login");
}



export async function callHelloWorld() {
  const session = supabase.auth.getSession();

  const { data, error } = await session;
  if (error || !data.session) {
    console.error("Not logged in or session error");
    return;
  }

  const accessToken = data.session.access_token;

  // Call Edge Function
  const res = await fetch("https://norhnvdhmkjjeqmpovlh.functions.supabase.co/hello-world", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await res.text();
  console.log("Function response:", text);
}
