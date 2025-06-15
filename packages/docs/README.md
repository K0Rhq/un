# @korhq/undocs

Build your docs in an Astro site, using unstyled docs primitives and schemas with all the functionality built in.

## Installation

```bash
npm install @korhq/undocs
```

## Features

### Content Collections

The package provides schemas and utilities for creating structured documentation using Astro's content collections.

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

### React Component Previews

Use the `reactComponentLoader` and `Playground` component to showcase React components in your documentation:

```ts
// content.config.ts
import { defineCollection } from "astro:content";
import { reactComponentLoader } from "@korhq/undocs";
import { z } from "astro/zod";

const previews = defineCollection({
  schema: z.object({
    title: z.string(),
    component: z.string().optional(),
  }).passthrough(),
  loader: reactComponentLoader({ previewsDir: "src/previews" }),
});

export const collections = { docs, previews };
```

Then use the Playground component to render your React components:

```astro
---
import { getCollection } from "astro:content";
import { Playground } from "@korhq/undocs";

const { preview } = Astro.props;
const { component, title } = preview.data;
---

<h1>{title}</h1>
{
