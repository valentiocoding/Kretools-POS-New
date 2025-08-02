import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Tambahan

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
       console.log("🔍 Supabase Session Data:", session); // ⬅️ Tambahkan ini
       
      if (session?.user) {
        setUser(session.user);
        setIsValid(true);
        
      } else {
        setUser(null);
        setIsValid(false);
      }
      setIsLoading(false); // ✅ Selesai cek, matikan loading
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsValid(true);
      } else {
        setUser(null);
        setIsValid(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Log hanya saat loading selesai
  useEffect(() => {
    if (!isLoading) {
      console.log("✅ Final Auth State:", isValid ? "Logged In" : "Not Logged In");
      console.log("User:", user?.email);
      
    }
  }, [isLoading, isValid]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsValid(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, isValid, isLoading, setIsValid, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
