import React, { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";

export interface Combo {
  id: string;
  name: string;
  description: string | null;
  items: string[];
  original_price: number | null;
  combo_price: number | null;
  offer: string | null;
}

interface ComboContextType {
  combos: Combo[];
  setCombos: Dispatch<SetStateAction<Combo[]>>;
}

const ComboContext = createContext<ComboContextType | undefined>(undefined);

export const ComboProvider = ({ children }: { children: ReactNode }) => {
  const [combos, setCombos] = useState<Combo[]>([]);

  useEffect(() => {
    const loadCombos = async () => {
      console.log("[ComboProvider] Loading combos from Supabase...");
      const { data, error } = await supabase.from("combos").select("*");

      if (error) {
        console.error("[ComboProvider] Failed to fetch combos:", error.message);
        return;
      }

      const normalized = ((data ?? []) as Array<Partial<Combo>>).map((combo) => ({
        id: combo.id || crypto.randomUUID(),
        name: combo.name || "Untitled Combo",
        description: combo.description || "",
        items: Array.isArray(combo.items) ? combo.items.filter((x): x is string => typeof x === "string") : [],
        original_price: typeof combo.original_price === "number" ? combo.original_price : 0,
        combo_price: typeof combo.combo_price === "number" ? combo.combo_price : 0,
        offer: combo.offer || "",
      }));

      console.log(`[ComboProvider] Combos fetched: ${normalized.length}`);
      setCombos(normalized);
    };

    void loadCombos();
  }, []);

  return <ComboContext.Provider value={{ combos, setCombos }}>{children}</ComboContext.Provider>;
};

export const useCombos = () => {
  const ctx = useContext(ComboContext);
  if (!ctx) throw new Error("useCombos must be used within ComboProvider");
  return ctx;
};
