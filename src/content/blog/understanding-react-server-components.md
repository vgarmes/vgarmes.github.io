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

The idea of Server Side Rendering is to perform the first React render on the server to generate HTML. At a high-level, our `<App />` from the previous example can be renderd on a Node.js server using a React method called `renderToString` (though more sophisticated approaches are currently in use):

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

Server Side Rendering is where you take your existing client Application and pre-run it on the server.

On the other side, React Server Components are React components that run *only* on the server. This server-only execution allows React Server Components to perform tasks that client components can't, such as accessing your database or backend services that you don't want to expose to the frontend. 

Because these components run on the server, they can handle asynchronous operations efficiently, running only once and passing data as props to client components. It's a similar concept to what framworks like Next.js did with `getServerSideProps`

By using React Server Components, you can build full-stack applications with React.

### Clarification about "Server" in Server Components
When we say the word server we don't necessearily mean that they run on the server but instead the fact that they run *ahead of time*. For example, Next.js which has implemented Server Components has as default configuration to run Server Components at *build time*. 


