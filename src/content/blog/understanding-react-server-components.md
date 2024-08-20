---
title: 'Understanding React Server Components'
pubDate: 2024-08-20
description: 'Recently, the React team unveiled a formal approach for running React components exclusively on the server. This represents a significant shift in how we use React, causing some confusion within the community. In this article, I explore this new concept and provide a foundational understanding of how it works.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1691097664/blog/build-your-own-react-routerwebp_wzdy1w.webp' 
    alt: 'Thumbnail with the blog post title'
tags: ["react", "server components"]
draft: false
---

React Server Components (RSC) are transforming the React ecosystem, with Next.js, one of the most popular frameworks, fully embracing this approach.

When I first heard about RSC, I completely misunderstood what they were. I initially thought RSC were simply Server Side Rendering (SSR) with additional features, such as the ability to await methods called directly on the backend. I couldn't have been more wrong, and it seems this misconception is quite common. 

RSC are much more than just enhanced SSR; in fact, they don't necessarily require SSR at all. In this blog post, I'll provide a high-level explanation that helped me build a mental model and will hopefully help you too. But first, let's start from the beginning.

## What are Client components

In a typical client-only React application, the user receives an empty HTML that looks like this:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>
```

React, which is included in the JavaScript bundle, uses the empty `<div id="root">` element to dynamically append all of the DOM nodes like this:

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

The idea of Server Side Rendering is to perform the first React render on the server to generate HTML and send it to the browser. At a high-level, our `<App />` from the previous example can be renderd on a Node.js server using a React method called `renderToString` (though more sophisticated approaches are currently in use):

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

Similarly to the `render` method, `renderToString` will recursively render all the components in `App` all the way down resulting in HTML code in string format. Please note that the HTML is simplified to the maximum for this example. In a real-life scenario, it would contain additional elements such as <script> tags to fetch the JavaScript bundle.

This approach has the advantage that the user can start viewing the content as soon as the HTML is received, even while the JavaScript is still loading, making the application more responsive.
Once the JavaScript has loaded, React makes the page interactive through a process called "hydration". During this process, React performs a render to determine the shape of the component tree and set up all of the interactivity, such as event listeners. As opposed to client-side rendering, this render is not used to create all of the DOM nodes, as they already exist from the server, but rather to integrate with the existing DOM.

In order to achieve this, React uses a method called `hydrateRoot` which is used instead of `createRoot` in client side rendering:

```diff
import React from 'react`
- import { createRoot } from 'react-dom/client';
+ import { hydrateRoot } from 'react-dom/client';

function App() {
  return (
    <h1>Hello world!</h1>
  );
}

- const root = createRoot(document.querySelector('#root'));
- root.render(<App />);
+ hydrateRoot(document.querySelector('#root'), <App />);
```

Note how, instead of creating DOM nodes and rendering them using the `createRoot` and `render` methods as we saw in the client side rendering example, now we just adopt the HTML received from the server using `hydrateRoot`:

## Server Components

React Server Components introduce a new approach where components are executed only once, exclusively on the server. They are truly static because they do not re-render or hydrate on the client. Once their output is rendered on the client, it remains unchanged and immutable. 

This server-only execution has several performance benefits, two of the main ones being:

- *Zero bundle size:* The code of RSC doesn't get added to your JavaScript bundle, which means you can safely use large dependencies without the risk of shipping them to the client. For example, if we needed to use a syntax highlighting library, which tend to be quite heavy, we could run it on the server to generate the syntax-highlighted code without shipping the dependency.

- *Secure access to backend services:* Since RSC run only on the server, they have direct access to data sources such as databases and file systems while safely keeping sensitive data and logic away from the client.

On the other hand, because RSC do not re-render on the client, they can't use most of React's APIs, such as state and effects. To differentiate RSC from other React components, the latter have been renamed to Client Components.

Moreover, the logic behind RSC needs to be tightly integrated with the bundler, the server, and the router. This is why, currently, [the simplest way to use RSC is with Next.js 13.4+](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), which incorporates them into its newly re-architected App Router.

### SSR vs RSC
Even though the concepts of SSR and RSC might seem similar since both involve running React components on the server, they differ fundamentally.

While SSR involves pre-running the client application on the server to generate HTML, RSC are rendered on the server, and their output is passed to the client as serialized objects. These serialized objects represent a React component tree, not static HTML.

In our previous example of an SSR application, if we had used RSC, the HTML received by the client would look something like this (truncated for simplicity):

```html
<!DOCTYPE html>
<html>
  <body>
    <p>Hello World!</p>
    <script src="/static/js/bundle.js"></script>
    <script>
      self.__next_f.push([1,
        [
          "$",
          "p",
          null,
          { children: "Hello World!" }
        ]
      ])
    </script>
  </body>
</html>
```

We see that this HTML includes the pre-rendered React application (the "Hello World!" paragraph), which is the result of SSR. Additionally, there are two <script> tags:

- The first tag loads the JavaScript bundle, which includes React and the client components.

- The second tag contains what RSC rendered—a serialized React object tree, known as the *React Server Component Payload*. During hydration, React uses this pre-rendered component tree as if it had been rendered on the client, even though the rendering occurred entirely on the server.

Even though the actual format of the RSC payload differs a bit—it has been simplified here for clarity—we can distinguish a few key elements.  The `"$"` symbol indicates a DOM definition, which in our case corresponds to the static HTML consisting of a `"p"` tag with `null` props and `Hello World!` as its `children`.

_NOTE: The term "server" in Server Components doesn't strictly mean that these components run on a server in real-time; rather, rendering ahead of time. For instance, by default, [Next.js configures Server Components to render at build time](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default), where the compiler pre-renders them into a serialized React object tree._

### Boundaries

When using RSC with Next.js, all components are assumed to be Server Components by default. We have to “opt in” for Client Components by using the `'use client'` directive on top of the component. 
 
However, Client Components can only import other Client Components. This means that when we import a Client Component into a Server Component, we create a boundary, and all components down the tree from that point will be treated as Client Components. Because of this, we don't have to add `'use client'` to every single file that needs to run on the client. In practice, we only need to add it when we're creating new client boundaries.

Let's see what happens if we take the same example from above and include a Client Component, such as a typical counter:

```js
// Counter.js
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

We place our `App` component in a Next.js `page` as an RSC, and then re-arrange it a bit to add the counter:

```js
// page.js
import Counter from './counter';

export default function App() {
  return (
    <div>
      <p>Hello world</p>
      <Counter />
    </div>
  )
}
```

If we inspect the HTML received by the client (also truncated for simplicity), we will see something like this:

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
              ['$', 'p', null, { children: 'Hello world' }],
              ['$', '$L4', null, {}],
            ],
          },
        ]
      ])
    </script>
  </body>
</html>
```

Now, we can see that our script tag containing the RSC payloads has changed. There is a new element in the serialized object starting with the number `4` and the letter `I`, followed by the path of our Client Component-the counter. Payloads that start with `I` are modules, which is how Client Components are loaded. The number `4` is simply an identifier for the payload.

Following that, we see our React component tree. In addition to our "Hello World" paragraph, there's now an element of type  `$L4`, which instructs React to load the module identified by `4` (our counter) in that position within the component tree.

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
