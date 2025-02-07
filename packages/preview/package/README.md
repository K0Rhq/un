# unPreview

## v0.1.0-experimental

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

import Button from "@/components/ui/Button.svelte"

<Button {...props} client:load>{props.text}</Button>
```

The variants you would like are defined in the frontmatter, with your variants under `variants:`, with your default option, and the other types you'd like. Right now, unPreview generates multiple components for each option you define, but the schema is meant for a control panel inspector, which should be implemented in the future.

To get the variants to your component you must define where you want them to go with `{props}`, you can use a spread operator on 1 component, or define specific ones like `{props.text}` anywhere you want.

## Usage

Make sure you have an Astro website ready to go, if you haven't made one already.

Install `@korhq/unpreview` with your package manager, from npm. We will support JSR in the future.

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

Create some previews MDX files. Learn how to define variants for your components here, if you want to preview multiple component variants via your props.

```src/previews/


### Create components

> Recommended directory: `src/components/playground`

Create `SidebarTree.astro`, which uses the `getCurrentLevelItems` function.

```astro
---
import type { CollectionEntry } from "astro:content";
import { getCurrentLevelItems } from "@korhq/unpreview";

type PreviewType = CollectionEntry<"previews">;
interface Props {
  items: PreviewType[];
  parentId?: string;
}
const { items, parentId } = Astro.props;

const currentLevelItems = getCurrentLevelItems(items, parentId);
---

{
  currentLevelItems.map((item) => {
    if (item.data.directory) {
      return (
        <details open>
          <summary>{item.data.title}</summary>
          <div class="flex flex-col gap-2 pl-6 pt-2">
            <Astro.self items={items} parentId={item.id} />
          </div>
        </details>
      );
    }
    return (
      <a
        href={`/playground/${item.id}`}
        class={` ${
          Astro.url.pathname === `/playground/${item.id}` && "text-orange-400"
        }`}
      >
        {item.data.title}
      </a>
    );
  })
}
```
