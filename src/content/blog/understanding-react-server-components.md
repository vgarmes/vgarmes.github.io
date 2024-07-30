---
title: 'Understanding React Server Components'
pubDate: 2024-08-15
description: 'The core of Single-Page Applications consists of its client routing which allows navigating through the pages without hitting the server. Here I explain how I have built my own basic React router to better understand the inner workings of SPAs.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1691097664/blog/build-your-own-react-routerwebp_wzdy1w.webp' 
    alt: 'Thumbnail with the blog post title'
tags: ["react", "server components"]
draft: true
---

React Server Components (RSCs) are transforming the React ecosystem, with Next.js, one of the most popular frameworks, fully embracing this approach.

When I first heard about RSCs, I completely misunderstood what they were. I initially thought RSCs were simply Server Side Rendering (SSR) with additional features, such as the ability to await methods called directly on the backend. I couldn't have been more wrong, and it seems this misconception is quite common. 

RSCs are much more than just enhanced SSR; in fact, they don't necessarily require SSR at all. In this blog post, I'll provide a high-level explanation that helped me build a mental model and will hopefully help you too. But first, let's start from the beginning.

## What are Client components

In a typical client-only React application, we have an empty `<div id="root">` in our HTML where React dynamically creates all of the DOM nodes like this:

```js
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <p>Hello World!</p>
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
```

When compiled, the `<App />` component is converted into a `React.createElement` call:

```js
React.createElement(
  'p',
  { id: 'hello' },
  'Hello World!'
);
``` 

This function returns a React element which is a plain JavaScript object that looks something like this:

```js
{
  type: "p",
  key: null,
  ref: null,
  props: {
    id: 'hello',
    children: 'Hello World!',
  },
  _owner: null,
  _store: { validated: false }
}
```

As you might already know this approach has its drawbacks. When a user visits a page built like this, the initial request retrieves an HTML file that is essentially empty.

The browser then starts downloading additional resources, including the JavaScript bundle. Only after this bundle is downloaded and parsed does React begin creating the DOM nodes, making the page finally usable. For larger applications, this means users may experience a significant delay with a blank page while the JavaScript is loading. This delay negatively impacts user experience, not to mention SEO.

This issue can be mitigated by rendering the initial React content on the server, which is where Server-Side Rendering (SSR) comes into play.

## Server Side Rendering

Taking the previous example, a React application can be rendered in a Node.js server using the `renderToString` method:

```js
/* /src/server/index.js */
import renderToString from 'react-dom/server';

import App from './components/App';

export function handleRequest(request, response) {
  const appContent = renderToString(<App />);

  response.send(`
    <html>
      <body>
        ${appContent}
      </body>
    </html>
  `);
}
```

Similarly to the `render` method, `renderToString` will recursively render all the components in `App` all the way down resulting in HTML code in string format.