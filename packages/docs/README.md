# unDocs

## v0.3.0-alpha

Build your docs in an Astro site, using unstyled docs primitives and schemas with all the functionality built in. Style it with your own brand and layout. Integrate within your current website.

This package provides schemas, recommended structures and helper functions to help you build your own docs UI. Right now, you have to build the UI and structure yourself. In the future, we'll have a CLI with presets available. We also will to offer headless, unstyled documentation components such as file trees, codeblocks, tabs, steps, and various plugins that you can style yourself.

## Installation

Make sure you have an Astro website ready to go, if you haven't made one already.

Install `@korhq/undocs` with your package manager.

## Docs Content Collection

You can write docs with Markdown and MDX. Markdoc is untested right now.

Make sure to use our schema from the `@korhq/undocs` package.

**src/content.config.ts**
```ts
import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

export const collections = { docs };
```

## Directories

You can organize your content in directories and subdirectories.

In each directory, create an `index.json` file with `directory` set to true, and the directory title.

```json
{
  "title": "Tesasdasdasdt",
  "directory": true
}
```

This will render directories (collapsibles) with the directory contents in the sidebar.

## Components

You should make your own static components such as Asides, Cards, etc.

Right now we provide simple dynamic, headless, unstyled components made in Astro, such as:

### Codeblock

The codeblock primitive has a copy button that copies Astro's default markdown codeblock, wrapped in a container.

Make your own `src/components/docs/Codeblock.astro`, importing from `@korhq/undocs/astro`.

Here's an example with a wrapper, and a filename/langName.

```astro
---
import { Codeblock as CodeblockPrimitive } from "@korhq/undocs/astro";

interface Props {
  filename?: string;
  langName: string;
}
const { filename, langName } = Astro.props;
---

<CodeblockPrimitive
  class="flex gap-1 p-2 flex-col h-fit text-white rounded-lg border border-white/10 mb-1 bg-neutral-950"
>
  <div class="w-full flex justify-between">
    <p class="text-xs font-mono">{filename || langName}</p>
    <button class="text-xs active:text-orange-400" id="undocs-copy-button"> <!-- The copy button must have this ID -->
      Copy
    </button>
  </div>
  <div id="codeblock"><slot /></div> <!-- The slot must be wrapped in div#codeblock -->
</CodeblockPrimitive>
```

And here's the usage of the example component:

```mdx
<Codeblock filename="goober.rs">
  ```rust
  fn main() {
    println!("goober is probably the silliest kitty in existence");
  }
  ```
</Codeblock>
```

### Tabs

The tabs primitive tabs logic .

Make your own `src/components/docs/Tabs.astro`, importing from `@korhq/undocs/astro`.

Here's an example component using tailwind + css to style the buttons.

```astro
---
import { Tabs as TabsPrimitive } from "@korhq/undocs/astro";
---

<TabsPrimitive class="flex flex-col gap-1 mb-1">
  <div class="flex p-2 pb-0 rounded-xl rounded-b-sm bg-neutral-900"> <!-- Tab buttons container -->
    <slot name="tab-buttons" />
  </div>
  <div class="bg-neutral-900 p-2 rounded-xl rounded-t-sm"> <!-- Tab contents container -->
    <slot />
  </div>
</TabsPrimitive>

<style>
  /* Use tailwind to style the buttons: */
  @reference "~/styles/global.css";

  :global(button[data-tab-id]) { /* Tab buttons default state */
    @apply px-2 border-b border-transparent;
  }

  :global(button[data-tab-id].active) { /* Tab buttons active state */
    @apply border-b border-orange-400;
  }

  :global(div[data-tab-id]) {
    @apply hidden;
  }

  :global(div[data-tab-id].active) {
    @apply block;
  }
</style>

```

And here's the usage of the example component:

```mdx
<Tabs>
  <Fragment slot="tab-buttons">
    <button data-tab-id="1">
      Tab 1
    </button>
    <button data-tab-id="2">
      Tab 2
    </button>
  </Fragment>

  <div data-tab-id="1">
    Lorem ipsum lore
  </div>
  <div data-tab-id="2">
    Dolar sit amet
  </div>
</Tabs>
```
The `Fragment` puts the buttons into the right slot, you can also apply the slot name to each button manually.

The `data-tab-id` matches each button and contents.
