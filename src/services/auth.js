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
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error("Not logged in or session error", error);
      return;
    }

    const accessToken = data.session.access_token;

    const res = await fetch("https://norhnvdhmkjjeqmpovlh.functions.supabase.co/hello-world", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Function failed: ${res.status} - ${err}`);
    }

    const text = await res.text();
    console.log("Function response:", text);
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}
