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
  const { order, order_details } = payload;

  const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
  if (!user) throw new Error("User not authenticated");

  // 1. Simpan order header
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: order.customer_name,
        total_price: order.total_price,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  const orderId = orderData.id;

  // 2. Siapkan data detail
  const detailsToInsert = order_details.map((detail) => ({
    ...detail,
    order_id: orderId,
  }));

  // 3. Simpan order_details
  const { error: detailsError } = await supabase
    .from("order_details")
    .insert(detailsToInsert);

  if (detailsError) throw detailsError;

  return orderId;
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