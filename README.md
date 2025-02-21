![un Banner](/.github/github.png)

# un

### In early alpha development stage

Build and preview your components & documentation actually with your own design. Give your project design more love with un.

## Codebase

- `packages/preview` unPreview components and templates
- `apps/cli` unCLI for initing un projects
- `apps/website` our website

### Commands

```bash
pnpm example:preview dev # testing/example environment for unPreview
pnpm example:docs dev # testing/example environment for unDocs
pnpm cli dev # the cli
pnpm site dev # website

pnpm fix # run biome/rustfmt/clippy tasks
```

# unUI

### Conceptual stages

Prebuilt, unstyled component files built with Zag, that you can easily drop in. Built with Zag state machines, so it supports any UI framework. Drop into your design package, your app, your monorepo, anywhere.

# [unPreview](https://github.com/K0Rhq/un/tree/main/packages/preview)

Preview your components and UI docs via previews made in MDX, inside an Astro component playground that you own. Supports any UI framework. Style it with your own brand and layout. Integrate within your current website or docs.

# [unDocs](https://github.com/K0Rhq/un/tree/main/packages/docs)

Build your docs in an Astro site, using unstyled docs primitives and schemas with all the functionality built in. Style it with your own brand and layout. Integrate within your current website.

# Contributing

Please feel free to work on some of the issues and make a PR! Contributions are appreciated.

Licensed under `Apache 2.0`
