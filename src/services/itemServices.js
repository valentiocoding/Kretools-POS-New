import { supabase } from "@/lib/supabaseClient";

export const getAllItems = async () => {
  const { data, error } = await supabase.from("items").select("*").order("id", { ascending: true });
  if (error) throw error;
  return data;
};

export const getAllMenus = async () => {
  const { data, error } = await supabase.from("items").select("*").eq("type", "menu").order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export const getAllMenusActive = async () => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("type", "menu")
    .eq("status", "Active")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
};


export const addItem = async (item) => {
  const { error } = await supabase.from("items").insert([item]);
  if (error) throw error;
};

export const updateItem = async (id, item) => {
  const { error } = await supabase.from("items").update(item).eq("id", id);
  if (error) throw error;
};

export const deleteItem = async (id) => {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
};




export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from("category_list")
    .select("*")
    .order("category", { ascending: true });

  if (error) throw error;
  return data;
};

export const countItemsByCategory = async (category) => {
  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true }) // count items, no data returned
    .eq("category", category)
    .eq("type", "menu");

  if (error) throw error;
  return count ?? 0; // jika count null, kembalikan 0
};




export const getAllAdditionals = async () => {
  const { data, error } = await supabase.from("items").select("*").eq("type", "additional").order("id", { ascending: true });
  if (error) throw error;
  return data;
};

export const getAllAdditionalsAcive = async () => {
  const { data, error } = await supabase
  .from("items")
  .select("*")
  .eq("type", "additional")
  .eq("status", "Active")
  .order("id", { ascending: true });
  if (error) throw error;
  return data;
};


export const insertOrder = async (payload) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const access_token = sessionData?.session?.access_token;

  if (!access_token) throw new Error("User not authenticated");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-midtrans-transaction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Gagal proses order + midtrans: " + errText);
  }

  const result = await res.json();
  return result; // berisi redirect_url, snap_token, dsb
};



export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      total_price,
      created_at,
      order_details (
        id,
        item_id,
        itemname,
        type,
        qty,
        price,
        subtotal,
        note
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};


export const deleteOrder = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
};