---
title: 'Understanding React Server Components'
pubDate: 2024-08-27
description: 'Recently, the React team unveiled a formal approach for running React components exclusively on the server. This represents a significant shift in how we use React, causing some confusion within the community. In this article, I explore this new concept and provide a foundational understanding of how it works.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1724193063/blog/e362ffcc-ed6f-4e71-855f-35ee52d1e0a5_ujxmau.jpg' 
    alt: 'Thumbnail with the blog post title'
tags: ["react", "server components"]
draft: false
---

NOTE: This post is not finished.

React Server Components (RSC) are transforming the React ecosystem, with Next.js, one of the most popular frameworks, fully embracing this approach.

When I first heard about RSC, I completely misunderstood what they were. I initially thought RSC were simply Server Side Rendering (SSR) with additional features, such as the ability to await methods called directly on the backend. I couldn't have been more wrong, and it seems this misconception is quite common. 

RSC are much more than just enhanced SSR; in fact, they don't necessarily require SSR at all. In this blog post, I'll provide a high-level explanation that helped me build a mental model and will hopefully help you too. But first, let's start from the beginning.

## How React renders

To better understand the behavior of Server Components and before we define the different rendering strategies, let's do a quick primer on how React actually renders a component. Imagine we have the typical counter:

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

These objects, known as the Virtual DOM, are React's way of describing the DOM structure. They are used to compare renders, identify changes, and determine what needs to be updated in the actual DOM. During rendering, React uses this Virtual DOM to compare the current state of the UI with a new version generated after a state or prop change. This comparison process, called reconciliation, allows React to efficiently update only the parts of the real DOM that have changed, rather than re-rendering the entire UI.

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

Then React, which is included in the JavaScript bundle, uses `<div id="root">` element to inject all of the DOM nodes once it's loaded on the client. To achieve this, React creates a root for the empty `<div id="root">` element and takes over managing the DOM inside it by calling `root.render`:

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js'

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
```

As you might already know this approach has its drawbacks. When a user visits a page built like this, the initial request retrieves an HTML file that is essentially empty.

The browser then starts downloading additional resources, including the JavaScript bundle. Only after this bundle is downloaded and parsed does React begin creating the DOM nodes, making the page finally usable. For larger applications, this means users may experience a significant delay with a blank page while the JavaScript is loading. This delay negatively impacts user experience, not to mention SEO.

This issue can be mitigated by rendering the initial React content on the server, which is where Server-Side Rendering (SSR) comes into play.

## What is Server Side Rendering

The idea of Server Side Rendering is to perform the first React render on the server to generate HTML and send it to the browser. At a high-level, our `<App />` from the previous example can be renderd on a Node.js server using a React method called `renderToString` (the HTML has been simplified for brevity):

```js
/* /src/server/index.js */
import renderToString from 'react-dom/server';
import App from './App.js';

export function handleRequest(request, response) {
  const appContent = renderToString(<App />);
  // <button>You pressed me 0 times</button>
  

  response.send(`
    <html>
      <body>
        ${appContent}
      </body>
    </html>
  `);
}
```

Similarly to the `render` method, `renderToString` will recursively render all the components in `App` all the way down resulting in HTML code in string format. Even though more sophisticated approaches that support features like streaming are currently in use, this gives us an idea of how SSR works.

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

React Server Components introduce a new approach where components are executed only once, exclusively on the server. They are truly static because they do not re-render or hydrate on the client. Once their output is rendered on the client, it remains unchanged and immutable. 

This server-only execution has several performance benefits, two of the main ones being:

- *Zero bundle size:* The code of RSC doesn't get added to your JavaScript bundle, which means you can safely use large dependencies without the risk of shipping them to the client. For example, if we needed to use a syntax highlighting library, which tend to be quite heavy, we could run it on the server to generate the syntax-highlighted code without shipping the dependency.

- *Secure access to backend services:* Since RSC run only on the server, they have direct access to data sources such as databases and file systems while safely keeping sensitive data and logic away from the client.

On the other hand, because RSC are not sent to the browser, they can't use any interactive APIs like `useState`. To differentiate RSC from other React components, the latter have been renamed to Client Components.

Moreover, the logic behind RSC needs to be tightly integrated with the bundler, the server, and the router. This is why, currently, [the simplest way to use RSC is with Next.js 13.4+](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), which incorporates them into its newly re-architected App Router.

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

An option would be to just use the `'use client'` directive at the top of the page, but let's take some advantage of Server Components and compose our code a little bit. 

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

Even though the concepts of SSR and RSC might seem similar at first glance since both involve running React components on the server,  they differ fundamentally as we have juse seen.

While SSR involves pre-running the client application on the server to generate HTML, RSC are rendered on the server, and their output is passed to the client as serialized objects. These serialized objects, known as the *React Server Component Payload*, represent a React component tree, not static HTML.

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

The second tag contains what RSC rendered—an array of RSC payloads representing the object tree. Even though the actual format of this object differs a bit—it has been simplified here for clarity—we can distinguish a few key elements.

In the payload array, the element starting with the number `4` and the letter `I`, followed by a file path is our Client Component-the counter. Payloads that start with `I` are modules, which is how Client Components are loaded. The number `4` is simply an identifier.

Following that, we see our React component tree. The `"$"` symbol indicates a DOM definition. First we have the `div` element which children are the `h1` heading and a `$L4` element. The latter instructs React to load the module identified by `4` (our counter) in that position within the component tree.

We can see some similarities between this object tree and what we previously saw rendered by `React.createElement`. In fact, during hydration, React uses this pre-rendered component tree just as it would if it had been rendered on the client, even though the initial rendering occurred entirely on the server.

## Conclusion

If SSR was a way to pre-render client applications on the server, RSC take it a step further by adding the performance benefits of running code solely on the server. 

RSC get even more interesting when combined with `Suspense` and the streaming SSR architecture,  allowing you to split the rendering work into chunks and stream them to the client as they become ready.

All of this represents a paradigm shift in the React ecosystem and will significantly change the way we build applications in the future.


## References

If you want to learn more about RSC, I highly recommend these invaluable references, which I used myself while writing this article:

- [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/#introduction-to-react-server-components-3): An exceptional and clear article by Josh Comeau, as usual, featuring plenty of helpful diagrams.
- [RSC from scratch](https://github.com/reactwg/server-components/discussions/5): A detailed technical deep dive by the great Dan Abramov (former React core team member), which walks you through the process of "inventing" RSC from scratch to provide a comprehensive mental model.
- [The forensics of React Server Components](https://www.smashingmagazine.com/2024/05/forensics-react-server-components/): A comprehensive explanation by Lazar Nikolov, who examines in detail the rendering lifecycle of RSC.
- [Data Feching with React Server Components](https://github.com/reactwg/server-components/discussions/5): An excellent RSC demo by Dan Abramov and Lauren Tan.
- [Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components): Next.js documentation on RSC, featuring a helpful explanation of how RSC are rendered and the various strategies involved.
