import { createContext, useContext, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export const SupabaseProvider = ({children,}: { children: React.ReactNode;}) =>
    {
    const supabase = useMemo(() => {
        return createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_KEY
        );
    }, []);

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);

    if (!context) {
        throw new Error(
            "useSupabase debe usarse dentro de SupabaseProvider"
        );
    }

    return context;
};
