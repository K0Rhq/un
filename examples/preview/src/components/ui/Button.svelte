<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { cva, type VariantProps } from "class-variance-authority";

  const button = cva("px-4 py-2 flex items-center justify-center gap-2", {
    variants: {
      variant: {
        primary: "bg-sky-800",
        secondary: "bg-neutral-800",
      },
    },
  });

  interface $$Props extends HTMLButtonAttributes, VariantProps<typeof button> {}

  /**
   * For Svelte components, we recommend setting your defaultVariants within
   * Svelte props (which are `undefined` by default)
   */
  export const { variant = "primary", ...rest } = $props();
</script>

<button {...rest} class={button({ variant })}>
  {@render rest.children?.()}
</button>
