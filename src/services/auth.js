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
