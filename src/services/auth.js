import { supabase } from "@/lib/supabaseClient";

export async function loginWithEmail(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
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

// ✅ Function untuk panggil Edge Function hello-world pakai token JWT
export async function callHelloWorld(name) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const access_token = sessionData?.session?.access_token;

  if (!access_token) {
    console.error("Tidak bisa ambil access_token:", sessionError);
    return null;
  }

  try {
    const res = await fetch("https://norhnvdhmkjjeqmpovlh.supabase.co/functions/v1/hello-world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify({ name }),
    });

    const result = await res.json();
    return result.message;
  } catch (err) {
    console.error("Update Gagal memanggil Edge Function:", err);
    return null;
  }
}
