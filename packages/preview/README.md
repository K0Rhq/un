# unPreview

## v0.1.2-alpha

Preview your components and UI docs via previews made in MDX, inside an Astro component playground that you own.

This package provides schemas, recommended structures and helper functions to help you build your own playground UI. Right now, you have to build your playground yourself. In the future, we'll have a CLI with presets available.

## Previews

Previews are kinda like stories if you're from Storybook. Previews are MDX files with your component imported and showed. You can define variants to generate multiple variants of your components in the preview.

Since unPreview is based on Astro content collections and MDX, by default we are framework agnostic, supporting any UI framework Astro supports (basically all of them), and we support monorepos, external packages, and standalone apps, since you can import your component from anywhere.

### Examples

Here's an example with variants defined.

```mdx
---
title: "Button"
variants:
  variant:
    default: "primary"
    options:
      - "primary"
      - "secondary"
  text:
    default: "Button"
    options:
      - "Button"
      - "another button"
---

import Button from "~/components/ui/Button.svelte"

<Button {...props} client:load>{props.text}</Button>
```

The variants you would like are defined in the frontmatter, with your variants under `variants:`, with your default option, and the other types you'd like. Right now, unPreview generates multiple components for each option you define, but the schema is meant for a control panel inspector, which should be implemented in the future.

To get the variants to your component you must define where you want them to go with `{props}`, you can use a spread operator on 1 component, or define specific ones like `{props.text}` anywhere you want.

## Usage

Make sure you have an Astro website ready to go, if you haven't made one already.

Install `@korhq/unpreview` with your package manager.

### Create content collection

Add the following to your `src/content.config.ts` file.

```ts
import { defineCollection } from "astro:content";
import { PreviewSchema } from "@korhq/unpreview";
import { glob } from "astro/loaders";

const previews = defineCollection({
	loader: glob({ pattern: "**/*.{json,mdx}", base: "./src/previews" }),
	schema: PreviewSchema,
});

export const collections = { previews };
```

Create some preview MDX files. Learn how to define variants for your components above, if you want to preview multiple component variants via your props.

### Create components

Follow the components in [`examples/preview`](https://github.com/K0Rhq/un/tree/main/examples/preview/src) for now.
