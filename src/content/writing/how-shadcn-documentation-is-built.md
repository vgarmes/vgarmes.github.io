---
title: "How shadcn's documentation is built"
pubDate: 2025-10-29
description: 'Building modern documentation sites with Fumadocs and Next.js'
tags: ['react', 'nextjs', 'documentation']
draft: false
---

[shadcn](https://ui.shadcn.com/) quickly became one of the most popular React component libraries due to its unique approach: building on Radix UI's accessibility primitives with a modern design system while giving developers complete control over their code.

Its documentation site has also become a reference point for many developers looking to build their own docs. After digging into the source code, I discovered that the site is built primarily with MDX, using [Fumadocs](https://fumadocs.dev/) and [Next.js](https://nextjs.org/).

In this post, I'll recreate the main parts of shadcn's documentation so you can build your own.

## Getting started

Let's start by creating a new Next.js project. If you already have an existing project, skip this step.

```bash
pnpm create next-app@latest my-app --yes
```

This command creates a new Next.js project with all the default options: TypeScript, Tailwind CSS, App Router, Turbopack, and `@/*`import alias configured.

Note that I'm using `pnpm` throughout this guide, but you can use your preferred package manager.

## Installing Fumadocs

Fumadocs consists of two main packages:

- `fumadocs-mdx` handles MDX processing and configuration
- `fumadocs-core` provides core functionality like navigation and search

Install the required packages:

```bash
pnpm add fumadocs-mdx fumadocs-core @types/mdx
```

Next, create a `source.config.ts` configuration file in your project root:

```ts
import { defineDocs, defineConfig } from 'fumadocs-mdx/config'

export const docs = defineDocs({
  dir: 'src/content/docs'
})

export default defineConfig()
```

This directory is where we will place all our MDX source files. This example assumes you have a `src` directory (the Next.js default), but feel free to adjust this to match your project structure.

Finally, update the `next.config.mjs` file at your project's root to configure it to use MDX:

```js
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true
}

const withMDX = createMDX({})

export default withMDX(config)
```

Note that the Next.js config must be a `.mjs` file since Fumadocs is ESM-only.

## Integrating with Fumadocs

Before we can integrate with Fumadocs, we need to run either `next dev` or `next build`. This generates the `.source` folder at the root directory, which is necessary for the integration.

Once that's done, create a `lib/source.ts` file and obtain the Fumadocs `source` from the docs collection output:

```ts
import { docs } from '.source'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource()
})
```

Note that importing directly from `.source` will only work if you've added the project root as the base URL (`"baseUrl": "."`) in the `compilerOptions` of our `tsconfig.json` file.

After this setup, you'll be able to write content in MDX format in the `src/content/docs` folder.

## Customizing the MDX components

Unless you use an out-of-the-box solution like `fumadocs-ui`, you'll need to define the styles and components used for each HTML element converted from MDX. You can do this by creating an `mdx-components.tsx` file in your root directory.

For example, here's how to style your main headings:

```tsx
import { cn } from '@/lib/utils'

export const mdxComponents = {
  h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={cn(
        'font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight',
        className
      )}
      {...props}
    />
  )
}
```

You can see how shadcn styles the rest of the elements in [their source code](https://github.com/shadcn-ui/ui/blob/main/apps/v4/mdx-components.tsx).

## Rendering your first MDX page

First, create an MDX file for testing. For example, create a page for a Button component at `src/content/docs/button.mdx`:

```mdx
---
title: Button
description: Displays a button or a component that looks like a button.
---

## Installation

pnpm dlx shadcn@latest add button
```

Next, add an optional catch-all route at `src/app/docs/[[...slug]]/page.tsx`. Using `generateStaticParams`, this will statically generate a route for each component in the content directory at build time:

```ts
// src/app/docs/[[...slug]]/page.tsx
import { source } from '@/lib/source'

export function generateStaticParams() {
  return source.generateParams()
}
```

Then you can read these params to get both the frontmatter data and the body using `source.getPage(["slug"])`:

```tsx
// src/app/docs/[[...slug]]/page.tsx
import { source } from '@/lib/source'
import { notFound } from 'next/navigation'
import { mdxComponents } from 'mdx-components'

export function generateStaticParams() {
  return source.generateParams()
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params

  const page = source.getPage(params.slug)

  if (!page) {
    return notFound()
  }

  const doc = page.data
  const MDX = doc.body

  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
        {doc.title}
      </h1>
      {doc.description && (
        <p className="text-muted-foreground text-balance text-[1.05rem] sm:text-base">
          {doc.description}
        </p>
      )}
      <MDX components={mdxComponents} />
    </div>
  )
}
```

As you can see, we're parsing the MDX frontmatter to extract the title and description, as well as the body which uses our custom `mdx-components`.

That's it! We should now be able to navigate to `/docs/button` and see our MDX rendered.

## Navigating between pages

shadcn also provides navigation to the previous or next component from any component page. You can quickly achieve this using the`findNeighbour` function from `fumadocs-core`:

```ts
 import { findNeighbour } from "fumadocs-core/page-tree";
 import { source } from "@/lib/source";

export default async function NavigationLinks(props: { pageUrl: string }) {
   const neighbours = findNeighbour(source.pageTree, pageUrl);
   return (
    <div className="flex items-center gap-3">
      {neighbours.previous && (
        <a href={neighbours.previous.url}>Previous</a>
      )}
      {neighbours.next && <a href={neighbours.next.url}>Next</a>}
    </div>
   );
}
```

The `pageUrl` can be passed down from the main component by getting `page.url`.

## Accessing the content tree

You can access the page tree from anywhere in your application. This is useful for listing all components in a sidebar, for example:

```tsx
import { source } from '@/lib/source'

export default function Home() {
  const pageTree = source.pageTree
  return (
    <ul>
      {pageTree.children.map(item => {
        return item.type === 'page' ? (
          <li key={item.url}>
            <a href={item.url}>{item.name}</a>
          </li>
        ) : null
      })}
    </ul>
  )
}
```

## Searching through the docs

Fumadocs provides built-in search functionality that integrates with Next.js API routes:

```ts
// app/api/search/route
import { createFromSource } from 'fumadocs-core/search/server'

import { source } from '@/lib/source'

export const { GET } = createFromSource(source)
```

You can then use this API endpoint in your client code:

```tsx
const { search, setSearch, query } = useDocsSearch({ type: 'fetch' })
```

The `search` and `setSearch` handle the state for storing the search string, while `query` works similarly to TanStack Query. For example, you can use `query.isLoading` to check if a query is loading, and `query.data` contains the documentation page results.

## Wrapping up

I hope you found this useful! In my opionion, this approach is an excellent solution for documenting a design system. By taking advantage of all the possibilities of MDX, it offers a flexible and composable alternative to other solutions like Storybook.
