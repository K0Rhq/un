import type React from "react";
import { useVariantsStore } from "@korhq/undocs";
import type { VariantOption } from "@korhq/undocs";

const Inspector: React.FC = () => {
  const { variants, selectedVariants, setSelectedVariant, resetToDefaults } =
    useVariantsStore();

  const handleVariantChange = (variantTitle: string, value: string) => {
    // Convert value to correct type based on options
    let typedValue: string | boolean | number = value;

    if (value === "true") typedValue = true;
    else if (value === "false") typedValue = false;
    else if (!Number.isNaN(Number(value))) typedValue = Number(value);

    setSelectedVariant(variantTitle, typedValue);
  };

  return (
    <div className="p-4 rounded-md bg-neutral-900 flex flex-col gap-3 col-span-1 h-full">
      <h2 className="text-xl">Inspector</h2>
      <div className="flex flex-col gap-4">
        {variants && variants.length > 0 ? (
          <>
            {variants.map((variant: VariantOption) => (
              <div key={variant.title} className="variant-control">
                <p className="block text-sm font-medium text-neutral-300 mb-1">
                  {variant.title}
                </p>
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-sm"
                  value={String(
                    selectedVariants[variant.title] ?? variant.default,
                  )}
                  onChange={(e) =>
                    handleVariantChange(variant.title, e.target.value)
                  }
                >
                  {variant.options.map((option) => (
                    <option key={String(option)} value={String(option)}>
                      {String(option)}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={resetToDefaults}
              className="mt-2 bg-neutral-800 hover:bg-neutral-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
            >
              Reset to Defaults
            </button>
          </>
        ) : (
          <p className="text-neutral-400 text-sm">
            No variants available for this component
          </p>
        )}
      </div>
    </div>
  );
};

export default Inspector;
