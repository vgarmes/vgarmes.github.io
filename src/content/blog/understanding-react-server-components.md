---
title: 'Understanding React Server Components'
pubDate: 2024-08-29
description: 'The paradigm shift of running React components on the server.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1724958842/blog/9e0060af-bc61-40cc-b516-2d13d013615b_v4pf3t.png' 
    alt: 'understanding react server components title on a blue background'
tags: ["react", "server components"]
draft: false
---

React Server Components (RSC) are transforming the React ecosystem, and Next.js, one of the most popular frameworks, is fully embracing this approach.

When I first learned about Server Components, I completely misunderstood them. I initially thought it was simply Server Side Rendering (SSR) with additional features, such as the ability to await methods called directly on the backend. I couldn't have been more wrong, and it seems this misconception is quite common. 

Server Components are much more than just enhanced SSR; in fact, they don't necessarily require SSR at all. In this blog post, I'll provide a high-level explanation that helped me build a mental model and will hopefully help you too. But first, let's start from the beginning.

## How React renders

To understand Server Components better, let's first review how React renders a component. Consider a simple counter component:

```js
// App.js
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You pressed me {count} times
    </button>
  );
}
```

When compiled, the output of this component is converted into a `React.createElement` call:

```js
// App.js
import { useState } from 'react';
import React from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return React.createElement(
    'button', 
    { onClick: () => setCount(count + 1) }, 
    `You pressed me ${count} times`
  );
}
``` 

When this function runs, it produces a plain JavaScript object that looks something like this:

```js
{
  type: 'button',
  key: null,
  ref: null,
  props: {
    onClick: () => setCount(count + 1),
    children:`You pressed me ${count} times`,
  },
  _owner: null,
  _store: { validated: false }
}
```

These objects, known as the Virtual DOM, are React's way of describing the DOM structure. They are used to compare renders, identify changes, and determine what needs to be updated in the actual DOM. 

During rendering, React uses this Virtual DOM to compare the current state of the UI with a new version generated after a state or prop change. This comparison process, called reconciliation, allows React to efficiently update only the parts of the real DOM that have changed, rather than re-rendering the entire UI.

But when does the initial render occur? This depends on whether our application is rendered entirely on the client side or not.

## Rendering on the client

In a traditional client-only React application, the user receives an empty HTML that looks like this:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>
```

React, which is included in the JavaScript bundle, uses the `<div id="root">` element to inject all the DOM nodes once it's loaded on the client. To achieve this, React creates a root for the empty `<div id="root">` element and takes over managing the DOM inside it by calling `root.render`:

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js'

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
```

As you might already know this approach has its drawbacks. When a user visits a page built like this, the initial request retrieves an HTML file that is essentially empty.

The browser then starts downloading additional resources, including the JavaScript bundle. Only after this bundle is downloaded and parsed does React begin creating the DOM nodes, making the page finally usable. For larger applications, this means users may experience a significant delay with a blank page while the JavaScript is loading. This delay negatively impacts user experience, not to mention SEO.

This issue can be mitigated by rendering the initial React content on the server, which is where Server Side Rendering comes into play.

## What is Server Side Rendering

Server Side Rendering (SSR) performs the initial React render on the server to generate HTML, which is then sent to the browser. At a high-level, our `<App />` from the previous example can be rendered on a Node.js server using a React method called `renderToString` (the HTML has been simplified for brevity):

```js
/* /src/server/index.js */
import renderToString from 'react-dom/server';
import App from './App.js';

export function handleRequest(request, response) {
  const appContent = renderToString(<App />);
  // the result of this is: "<button>You pressed me 0 times</button>"
  
  response.send(`
    <html>
      <body>
        ${appContent}
      </body>
    </html>
  `);
}
```

Similar to the `render` method, `renderToString` recursively renders all components in `App`, producing HTML as a string. Even though more sophisticated strategies that support features like streaming are currently in use, this gives us an idea of how SSR works.

This approach has the advantage that the user can start viewing the content as soon as the HTML is received, even while the JavaScript is still loading, making the application more responsive.

Once the JavaScript has loaded, React makes the page interactive through a process called "hydration". During this process, React performs a render to determine the shape of the component tree and set up all of the interactivity, such as event listeners. As opposed to client-side rendering, this render is not used to create all of the DOM nodes, as they already exist from the server, but rather to integrate with the existing DOM.

In order to achieve this, React uses a method called `hydrateRoot` which is used instead of `createRoot` in client side rendering:

```diff
import React from 'react'
import App from './App'
- import { createRoot } from 'react-dom/client';
+ import { hydrateRoot } from 'react-dom/client';

- const root = createRoot(document.querySelector('#root'));
- root.render(<App />);
+ hydrateRoot(document.querySelector('#root'), <App />);
```

Note how, instead of creating DOM nodes and rendering them using the `createRoot` and `render` methods as we saw in the client side rendering example, now we just adopt the HTML received from the server using `hydrateRoot`.

## Server Components

Server Components introduce a new approach where components are executed only once, exclusively on the server. They are truly static because they do not re-render or hydrate on the client. Once their output is rendered on the client, it remains unchanged and immutable. 

This server-only execution offers several performance benefits, including:

- *Zero bundle size:* The code of Server Components doesn't get added to your JavaScript bundle, which means you can safely use large dependencies without the risk of shipping them to the client. For example, if we needed to use a syntax highlighting library, which tend to be quite heavy, we could run it on the server to generate the syntax-highlighted code without shipping the dependency.

- *Secure access to backend services:* Since Server Components run only on the server, they have direct access to data sources such as databases and file systems while safely keeping sensitive data and logic away from the client.

On the other hand, because Server Components are not sent to the browser, they can't use any interactive APIs like `useState`. To differentiate Server Components from other React components, the latter have been renamed to Client Components.

The logic behind Server Components must be tightly integrated with the bundler, server, and router. Currently, [the simplest way to use Server Components is with Next.js 13.4+](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), which incorporates them into its newly re-architected App Router.

_NOTE: The term "server" in Server Components doesn't strictly mean that these components run on a server in real-time; rather, rendering ahead of time. For instance, by default, [Next.js configures Server Components to render at build time](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)._

### Boundaries

When building with Next.js, all components are assumed to be Server Components by default. To add interactivity, you need to "opt-in" by adding the `'use client'` directive at the top of the component file. This directive will convert the all the components in that file into Client Components.
 
However, Client Components can only import other Client Components. This means that when we import a Client Component into a Server Component, we create a boundary, and all components down the tree from that point will be treated as Client Components. Because of this, we don't have to add `'use client'` to every single file that needs to run on the client. In practice, we only need to add it when we're creating new client boundaries.

Let's imagine we are creating a new page in Next.js:

```js
/* app/page.js */
export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You pressed me {count} times
    </button>
  );
}
```

As soon as we tried to compile this, an error will be thrown indicating that we are using state in a Server Component. 

One option is to use the `'use client'` directive at the top of the page, but let's take advantage of Server Components by refactoring our code. 

We can start by moving the counter to its own Client Component like so:

```js
// Counter.js
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You pressed me {count} times
    </button>
  );
}
```

Then we could add some elements in our Server Component page and include our counter:

```js
// page.js
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>My counter</h1>
      <Counter />
    </div>
  )
}
```

Now we won't get any compilation errors, our Server and Client components are properly separated by the boundary in the counter.

### Server Components vs SSR

Even though the concepts of SSR and Server Components might seem similar at first glance since both involve running React components on the server, they differ fundamentally as we have juse seen.

While SSR pre-renders the client application on the server to generate HTML, Server Components are rendered on the server, with their output passed to the client as serialized objects. These serialized objects, known as the *Server Component Payload*, represent a React component tree, not static HTML.

If we were to inspect the HTML of the previous page when received by the client (also truncated for simplicity), we would see something like this:

```html
<!DOCTYPE html>
<html>
  <body>
    <p>Hello World!</p>
    <script src="/static/js/bundle.js"></script>
    <script>
      self.__next_f.push([1,
        "4:I[(app-pages-browser)/./src/app/counter.js\",
        [
          '$',
          'div',
          null,
          { children: [
              ['$', 'h1', null, { children: 'My counter' }],
              ['$', '$L4', null, {}],
            ],
          },
        ]
      ])
    </script>
  </body>
</html>
```

As we can see, next to our server-side rendered HTML, there are two <script> tags.

The first tag loads the JavaScript bundle, which includes React and the Client Components.

The second tag contains what Server Components rendered—an array of payloads representing the object tree. Even though the actual format of this object differs a bit—it has been simplified here for clarity—we can distinguish a few key elements.

In the payload array, the element starting with the number `4` and the letter `I`, followed by a file path is our Client Component-the counter. Payloads that start with `I` are modules, which is how Client Components are loaded. The number `4` is simply an identifier. Also, notice that I included the file path as it would appear in development. In a production build, we would see something like `static/chunks/app/page-2bf114d4cb295821.js` instead.

Following that, we see our React component tree. The `"$"` symbol indicates a DOM definition. First we have the `div` element which children are the `h1` heading and a `$L4` element. The latter instructs React to load the module identified by `4` (our counter) in that position within the component tree.

We can see some similarities between this object tree and what we previously saw rendered by `React.createElement`. In fact, during hydration, React uses this pre-rendered component tree just as it would if it had been rendered on the client, even though the initial rendering occurred entirely on the server.

If we were to look for the heading `Hello World!` in our bundle, it wouldn't appear. This is one of the strengths of Server Components. This was just a very simple example, but it could be scaled up to more complex processes like querying data from a database, reading from the file system, doing code highlighting, etc., and none of it would be included in the bundle—just a payload with the rendered component tree.

## Conclusion

While SSR pre-renders client applications on the server, Server Components takes it a step further by providing the performance benefits of running code exclusively on the server.

Server Components become even more powerful when combined with Suspense and streaming SSR architecture, which allows rendering work to be split into chunks and streamed to the client as they become ready.

All of this represents a paradigm shift in the React ecosystem and will significantly change the way we build applications in the future.

## References

If you want to learn more about React Server Components, I highly recommend these invaluable references, which I used myself while writing this article:

- [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/#introduction-to-react-server-components-3): An exceptional and clear article by Josh Comeau, featuring numerous helpful diagrams that make the concepts easy to understand.
- [RSC from scratch](https://github.com/reactwg/server-components/discussions/5): A detailed technical deep dive by Dan Abramov (former React core team member), which walks you through the process of "inventing" RSC from scratch to provide a comprehensive mental model.
- [The forensics of React Server Components](https://www.smashingmagazine.com/2024/05/forensics-react-server-components/): A comprehensive explanation by Lazar Nikolov, who examines in detail the rendering lifecycle of RSC.
- [Data Fetching with React Server Components](https://github.com/reactwg/server-components/discussions/5): An excellent demo on how to handle data fetching in RSC, by Dan Abramov and Lauren Tan.
- [Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components): Next.js documentation on RSC, featuring a helpful explanation of how RSC are rendered and the various strategies involved.
