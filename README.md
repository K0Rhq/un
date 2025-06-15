![un Banner](/.github/github.png)

# unDocs

### `v0.4.0-alpha`

A documenation framework built with Astro where you can build your own docs and component playground where you control the layout, components, and design.

## Codebase

We use pnpm and Turborepo for this codebase.

- `packages/docs` unDocs loaders, schemas, and components
- `examples/docs` testing and example environment for unDocs
- `apps/website` our website (empty right now)


Please feel free to work on some of the issues and make a PR! Contributions are appreciated.

Licensed under `Apache 2.0`

### Commands

```bash
pnpm example:docs dev # testing/example environment for unDocs
pnpm docs build # unDocs package
pnpm site dev # website

pnpm fix # run biome/rustfmt/clippy tasks
```

# unDocs Docs

Our documentation will be in this README for now, once we have a website we will move it to there.

With unDocs & unPreview, you make the components, pages, and playground yourself. The package provides component primitives, helper functions and schemas to help you with that. This is so you can control the design and layout of everything.

> [!IMPORTANT]  
> unPreview is the term for the playground, where `previews` are kind of like stories.
>
> unPreview only supports React right now. Soon we will support Svelte and Vue.

> [!TIP]  
> unPreview is kinda the highlight right now. If you would like to use unDocs, I would wait, because we still need to add critical features like a Site Search. Any contributions would mean a lot!

### Getting Started

1. Initate an Astro project, ex. `pnpm create astro@latest`
2. Install the UI framework you're using (unPreview only supports React), ex. `pnpm astro add react`
2. Install the Astro MDX integration, ex. `pnpm astro add mdx`
3. Install `@korhq/undocs` with your package manager.

## Docs

### Create docs collection

Create a content collection with our `DocsSchema` in `content.config.ts`.
```ts
import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

export const collections = { docs };
```

#### Schema

| value      | description      | type |
| ------------- | ------------- | ----------- |
| title | The title of your page. | string |
| directory | **only used in `index.json`** to define that directory as a directory | boolean |

### Create the docs layout components.

You will need a `Sidebar` and `SidebarTree`. Style these however you want, this is what's in the example.

#### `src/components/docs/SidebarTree.astro`
```astro
---
import type { CollectionEntry } from "astro:content";
import { getCurrentLevelItems } from "@korhq/undocs";

type DocsType = CollectionEntry<"docs">;
interface Props {
    items: DocsType[];
    parentId?: string;
    slugPath?: string;
}
const { items, parentId, slugPath } = Astro.props;

const currentLevelItems = getCurrentLevelItems(items, parentId);
---

{
    currentLevelItems.map((item: DocsType) => {
        if (item.data.directory) {
            return (
                <details open>
                    <summary>{item.data.title}</summary>
                    <div class="flex flex-col gap-2 pl-6 pt-2">
                        <Astro.self
                            items={items}
                            parentId={item.id}
                            slugPath={slugPath}
                        />
                    </div>
                </details>
            );
        } else
            return (
                <a
                    href={`/${slugPath}/${item.id}`}
                    class={` ${
                        Astro.url.pathname === `/${slugPath}/${item.id}` &&
                        "text-orange-400"
                    }`}
                >
                    {item.data.title}
                </a>
            );
    })
}
```

#### `src/components/docs/Sidebar.astro`
```astro
---
import SidebarTree from "./SidebarTree.astro";

const { content, slugPath } = Astro.props;
---

<div
    class="p-4 rounded-md bg-neutral-900 flex flex-col gap-3 col-span-1 h-full"
>
    <a
        href="/"
        class="text-3xl bg-gradient-to-r w-fit from-orange-400 to-yellow-300 inline-block text-transparent bg-clip-text hover:font-bold transition-all duration-150 ease-out"
        >unDocs</a
    >
    <hr class="border-neutral-700" />
    <SidebarTree items={content} slugPath={slugPath} />
    <div class="flex-grow"></div>
    <a href="https://github.com/K0Rhq/un" class="text-xs text-neutral-500"
        >Powered by unDocs</a
    >
</div>
```

### Create the docs pages.

Integrate your layouts and styles however you want. This is what's in the example:

#### `src/pages/docs/[...id].astro`
```astro
---
import Layout from "../layouts/Layout.astro";
import Sidebar from "../components/docs/Sidebar.astro";
import { getCollection, render, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
    const docs = await getCollection("docs");
    type Docs = CollectionEntry<"docs">;
    const filteredDocs = docs.filter((doc: Docs) => !doc.data.directory);
    return filteredDocs.map((doc: Docs) => ({
        params: { id: doc.id },
        props: { doc },
    }));
}

const docs = await getCollection("docs");

interface Props {
    doc: CollectionEntry<"docs">;
}
const { doc } = Astro.props;
const { Content } = await render(doc);
---

<Layout>
    <div class="grid-cols-5 grid gap-4 h-full">
        <Sidebar content={docs} slugPath="docs" />
        <div class="col-span-4 flex justify-center h-full w-full">
            <div
                class="max-w-[512px] min-w-0 w-full border border-white/10 rounded-lg p-4"
            >
                <h1 class="text-2xl">{doc.data.title}</h1>
                <div class="untypography">
                    <Content />
                </div>
            </div>
        </div>
    </div>
</Layout>
```

Optionly create an `src/pages/docs/index.astro` to redirect to the first doc at the `/docs` route.

```astro
---
import { getCollection } from "astro:content";

const items = await getCollection("docs");
return Astro.redirect(`/docs/${items[0].id}`);
---
```

### Create the docs components

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
import Codeblock from "~/components/docs/Codeblock.astro";

<Codeblock filename="goober.rs">
  ```rust
  fn main() {
    println!("goober is probably the silliest kitty in existence");
  }
  ``
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
import Tabs from '~/components/docs/Tabs.astro';

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
    Lorem ipsum
  </div>
  <div data-tab-id="2">
    Dolar sit amet
  </div>
</Tabs>
```
The `Fragment` puts the buttons into the right slot, you can also apply the slot name to each button manually.

The `data-tab-id` matches each button and contents.

### Create some Documentation!

Here's an example structure:
```
src/docs/
├── hello.mdx
└── directory/
    ├── test.mdx
    └── index.json
```

Here's what you'd put in the MDX files:
```md
---
title: Hello
---

# Hello world
lorem ipsum
```
To define directories, you need to put an `index.json` in the root of each.
```json
{
  "title": "Test directory",
  "directory": true
}
```

## Component Previews

With unPreview you use the same `Sidebar` and `SidebarTree` component we made earlier. unPreview introduces a React Preview loader for content collections, and an `Inspector` to change variants.

### Create previews collection

Create a content collection with our `reactPreviewLoader` in `content.config.ts`.
```ts
import { defineCollection } from "astro:content";
import { reactPreviewLoader } from "@korhq/undocs";

const previews = defineCollection({
  loader: reactPreviewLoader({ previewsDir: "src/previews" }),
});

export const collections = { previews };
```

We will explain naming your previews and that schema later.

### Create playground components

These playground components have to be made in your chosen UI framework (we only support React right now.)

#### `src/components/playground/Playground.tsx`

Customize the loading/errors however you want. This component also loads any variants from your preview into a Zustand store, you may need to install `zustand`.

```tsx
import { Suspense, useState, useEffect } from "react";
import type { ComponentType } from "react";
import { useVariantsStore } from "@korhq/undocs";
import type { VariantOption } from "@korhq/undocs";

interface PlaygroundProps {
  component: string;
  variants?: VariantOption[];
}

export default function Playground({ component, variants }: PlaygroundProps) {
  const [Component, setComponent] = useState<ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedVariants = useVariantsStore((state) => state.selectedVariants);

  const filename = component;

  // Initialize variants when component mounts or variants change
  useEffect(() => {
    if (variants) {
      useVariantsStore.getState().setVariants(variants);
    }
  }, [variants]);

  useEffect(() => {
    async function loadComponent() {
      try {
        // Clear any previous component and error
        setComponent(null);
        setError(null);

        // Dynamically import the component
        const importedModule = await import(
          /* @vite-ignore */ `../../previews/${filename}`
        );
        const LoadedComponent = importedModule.default;

        if (!LoadedComponent) {
          throw new Error(`No default export found in ${filename}`);
        }

        setComponent(() => LoadedComponent);
      } catch (err) {
        console.error("Error loading preview:", err);
        setError(`Failed to load preview: ${filename}`);
      }
    }

    if (filename) {
      loadComponent();
    }
  }, [filename]);

  if (error) {
    return (
      <div id="unpreview-error" className="text-red-400">
        {error}
      </div>
    );
  }

  if (!Component) {
    return <div id="unpreview-loading">Loading preview...</div>;
  }

  return (
    <Suspense fallback={<div id="unpreview-loading">Loading...</div>}>
      <Component {...selectedVariants} />
    </Suspense>
  );
}
```
#### `src/components/playground/Inspector.tsx`

This grabs any variants from the store, and loads them into select boxes. It is reccomended to use the default HTML select boxes.

```tsx
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
```

### Create preview pages
Using the same idea from our docs pages, customize with your own layout and styles.

#### `src/pages/preview/[...id].astro`

```astro
---
import Layout from "~/layouts/Layout.astro";
import Sidebar from "~/components/docs/Sidebar.astro";
import { getCollection, type CollectionEntry } from "astro:content";
import Playground from "~/components/playground/Playground";
import Inspector from "~/components/playground/Inspector";
import type { VariantOption } from "@korhq/undocs";

export async function getStaticPaths() {
    const previews = await getCollection("previews");
    type Preview = CollectionEntry<"previews">;
    return previews.map((preview: Preview) => ({
        params: { id: preview.id },
        props: { preview },
    }));
}

const previews = await getCollection("previews");
interface Props {
    preview: CollectionEntry<"previews">;
}
const { preview } = Astro.props;
const { component, title = "Preview", variants = [] } = preview.data || {};
---

<Layout>
    <div class="grid-cols-5 grid gap-4 h-full">
        <Sidebar content={previews} slugPath="preview" />
        <div class="col-span-3 flex justify-center h-full w-full">
            <div
                class="max-w-[512px] min-w-0 w-full border border-white/10 rounded-lg p-4"
            >
                <h1 class="text-2xl">{title}</h1>
                <div>
                    {
                        component ? (
                            <Playground
                                component={component}
                                variants={variants}
                                client:load
                            />
                        ) : (
                            <div>
                                <p class="text-red-400">
                                    Error rendering playground: component
                                    property not found.
                                </p>
                                <p class="text-red-400">
                                    Preview.data keys:{" "}
                                    {JSON.stringify(
                                        Object.keys(preview.data || {}),
                                    )}
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
        <Inspector client:load />
    </div>
</Layout>
```

#### `src/pages/preview/index.astro`

Optionly create a page to redirect to the first preview at the route `/preview`.

```astro
---
import { getCollection } from "astro:content";

const items = await getCollection("previews");
return Astro.redirect(`/preview/${items[0].id}`);
---
```

### Create some Previews!

You can use the same directory system as with docs.

Each preview in your collection directory must end with `.preview.tsx`. Here's how defining your component, variants and the title works.

#### Export your main component preview
Simply export a default function named `Preview`. You can put any type of component in here now. This is what will appear in the preview.
```tsx
export default function Preview() {
  return (
    <button>Test</button>
  );
}
```

#### Defining a custom title

Export a const named `PreviewProps` at the top of the file.
```ts
export const PreviewProps = {
  title: "Button",
};
```

#### Defining variants for the inspector

Define your variants in `PreviewProps`, then take them in the `Preview` component.

##### `variants` Schema

`variants` is an array of objects with this schema:

| value      | description      | type |
| ------------- | ------------- | ----------- |
| title | The name of the variant, all lowercase. | string |
| options | The avaiable options for that variant | string[] / number[] / boolean[] |
| default | The default option selected (must be one of the options defined above) | string / number / boolean |

```ts
export const PreviewProps = {
  title: "Button",
  variants: [
    {
      title: "variant",
      options: ["primary", "secondary", "success", "warning", "danger"],
      default: "primary",
    },
    {
      title: "disabled",
      options: [true, false],
      default: false,
    },
  ],
};
```

Now you can use these variants in the `Preview`, by adding `{ ...props }` to the props, and using them in your components.

```tsx
export default function Preview({ ...props }) {
  return (
    <div>
      <Button {...props}>Button</Button>
    </div>
  );
}
```

Or specifically define them with the variant names:

```tsx
export default function Preview({ ...props }) {
  return (
    <div>
      <Button variant={props.variant} disabled={props.disabled}>Button</Button>
    </div>
  );
}
```

Now the variants should appear in the inspector and you should be able to edit them in real time in the playground. Have fun!

## Overview

What you've just created is custom documenation and a custom UI component playground, and you created all the components for the layout yourself. You can now customize this however you want, integrating your design system. 
