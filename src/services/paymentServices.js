import { supabase } from "@/lib/supabaseClient";

export async function createMidtransTransaction(order) {
  const { data: sessionData } = await supabase.auth.getSession();
  const access_token = sessionData.session.access_token;

  const res = await fetch(
    "https://norhnvdhmkjjeqmpovlh.functions.supabase.co/create-midtrans-transaction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(order),
    }
  );

  if (!res.ok) throw new Error("Failed to create Midtrans transaction");

  return await res.json(); // return { token, redirect_url }
}
