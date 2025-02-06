function generateVariantObjects<T>(
  optionsArrays: T[][],
  variantKeys: string[],
): Record<string, unknown>[] {
  const combinations = optionsArrays.reduce(
    (combinations, options) =>
      combinations.flatMap((combo) =>
        options.map((option) => [...combo, option]),
      ),
    [[]] as T[][],
  );

  return combinations.map((optionValues) =>
    optionValues.reduce<Record<string, unknown>>(
      (acc, val, idx) => {
        acc[variantKeys[idx]] = val;
        return acc;
      },
      {} as Record<string, unknown>,
    ),
  );
}

/**
 * Generates all possible variant combinations from a variant configuration object
 * @param variantConfig (preview.data.variants) An object where each key represents a variant property and its value is an object containing an 'options' array of possible values
 * @returns An array of objects representing all possible combinations of   variants
 */
export function generateVariants(
  variantConfig: Record<string, { options: unknown[] }>,
) {
  if (!variantConfig) {
    return [];
  }

  const variantKeys = Object.keys(variantConfig);
  const optionsArrays = variantKeys.map(
    (key) => variantConfig[key]?.options ?? [],
  );

  return generateVariantObjects(optionsArrays, variantKeys);
}
