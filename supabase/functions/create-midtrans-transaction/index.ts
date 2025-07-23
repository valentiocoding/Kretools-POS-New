import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ✅ CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://kretools-pos.netlify.app", // ganti ke https://kretools-pos.netlify.app jika sudah deploy
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    console.log("🔍 Received body:", body); // ✅ Debug log

    const {
      order_id,
      gross_amount,
      customer_name,
      email,
      phone,
    } = body;

    if (!order_id || !gross_amount || !customer_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) {
      return new Response(JSON.stringify({ error: "Midtrans server key not configured" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const midtransUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";
    const snapBody = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customer_name,
        email: email || "noemail@example.com",
        phone: phone || "08123456789",
      },
    };

    const midtransRes = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " + btoa(`${serverKey}:`),
      },
      body: JSON.stringify(snapBody),
    });

    const midtransJson = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error("❌ Midtrans error:", midtransJson);
      return new Response(JSON.stringify({ error: midtransJson }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("✅ Midtrans success:", midtransJson);

    return new Response(JSON.stringify({
      token: midtransJson.token,
      redirect_url: midtransJson.redirect_url,
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
