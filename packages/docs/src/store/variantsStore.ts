import { create } from "zustand";
import type { VariantOption } from "../schemas/variant";

interface VariantsState {
  variants: VariantOption[] | undefined;
  selectedVariants: Record<string, string | boolean | number>;
  setVariants: (variants: VariantOption[]) => void;
  setSelectedVariant: (
    variantTitle: string,
    value: string | boolean | number,
  ) => void;
  resetToDefaults: () => void;
}

export const useVariantsStore = create<VariantsState>((set, get) => ({
  variants: [],
  selectedVariants: {},

  setVariants: (variants) => {
    const defaultSelections: Record<string, string | boolean | number> = {};

    // Initialize selected variants with defaults
    for (const variant of variants) {
      defaultSelections[variant.title] = variant.default;
    }

    set({
      variants,
      selectedVariants: defaultSelections,
    });
  },

  setSelectedVariant: (variantTitle, value) => {
    set((state) => ({
      selectedVariants: {
        ...state.selectedVariants,
        [variantTitle]: value,
      },
    }));
  },

  resetToDefaults: () => {
    const { variants } = get();
    const defaultSelections: Record<string, string | boolean | number> = {};
    if (variants) {
      for (const variant of variants) {
        defaultSelections[variant.title] = variant.default;
      }
    }
    set({ selectedVariants: defaultSelections });
  },
}));