// supabase/functions/create-midtrans-transaction/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();

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
      });
    }

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) {
      return new Response(JSON.stringify({ error: "Midtrans server key not configured" }), {
        status: 500,
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
          "Basic " + btoa(`${serverKey}:`), // Base64(ServerKey + ":")
      },
      body: JSON.stringify(snapBody),
    });

    const midtransJson = await midtransRes.json();

    if (!midtransRes.ok) {
      return new Response(JSON.stringify({ error: midtransJson }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({
      token: midtransJson.token,
      redirect_url: midtransJson.redirect_url,
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://kretools-pos.netlify.app", // Allow all origins, adjust as needed

      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
    });
  }
});
