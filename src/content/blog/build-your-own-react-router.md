---
layout: ../../layouts/post.astro
title: 'Build your own React router'
pubDate: 2023-07-19
description: 'The core of Single-Page Applications consists of its client routing which allows navigating through the pages without hitting the server. I made a basic React router to better understand this behavior.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1689889088/blog/overview_ugl3u2.webp' 
    alt: 'Custom command prompt with Powershell'
tags: ["react", "router", "spa"]
draft: true
---
Single-Page Applications (SPAs) are incredibly popular, especially for highly interactive applications. The key feature of SPAs is that they consist of a single JavaScript application, which generates the HTML of every page after the initial load without the need to hit the server again. This allows the application to maintain state and memory across pages seamlessly. Frameworks like Next.js, SvelteKit, and Remix are all examples of SPA frameworks, even though some of them offer server-side rendering capabilities.

At the core of these applications, there lies a router running on the client-side. This router is what prevents the client from requesting new pages from the server and instead lets the JavaScript application generate the corresponding page.

To gain a better understanding of how routing in SPAs works, I decided to create my own router using React and TypeScript. While building this router, I used as reference the source code of the popular library React Router made by the guys at Remix, but I focused on simplicity and implemented only the essential features.

This is how we can build it.

## Getting started

As a base application to test the router, I created an appication using [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) with the React and Typescript + SWC template.

As in most typical SPAs made with React, this template will create an almost empty `index.html` file with a root <div> element. Then, there will also be a JavaScript file (in this case Typescript) where React will inject the rendered HTML inside this root element:

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

The file `App.tsx` is where we will have to use our router to control what page is going to be rendered depending on the client location, enabling client side routing.

Similarly to what React Router does, we will implement a Router component that accepts the routes as props. Therefore, we can start by creating the routes object and doing a first attempt on conditionally rendering the corresponding route depending on the current location:

```tsx
// App.tsx
const routes = [
    {
        path: '/',
        element: (
            <div>
                <h1>Hello World!</h1>
                <a href="/about">About us</a>
            </div>
        ),
    },
    {
        path: '/about',
        element: (
            <div>
                <h1>About us</h1>
                <a href="/">Go back home</a>
            </div>
        ),
    },
]

function 404Page() {
    return (
         <div>
            <h1>404</h1>
        </div>
    )
}

function App() {
    const currentPathname = window.location.pathname;
    const Page = routes.find((route) => route.path === currentPathname)?.element
    return (
        <main>
            {Page ? Page : 404Page}
        </main>
    )
}
```

This will find a matching route and render the corresponding page, otherwise it will render a 404 page. 

There is a problem though. If you try to click on the links above to navigate between the root page `/` and `/about`, you will notice that every time you navigate to page, a request will be sent to the server to get the corresponding HTML file and all the JavaScript application. This is what we want to avoid in order to turn this application into an SPA, so we will need to intercept all the navigation.

## Intercepting navigation

For intercepting all navigation to prevent the browser default behavior, we are going to need to do a couple of things:
1. Create a function we can call in an anchor element (and anywhere else) for navigating to a different page.
2. Replace the default behavior when the user wants to navigate back (browser back button).

### Creating a function to navigate to another path

First of all, we will need a function that we can call every time we need to navigate to a different page. The approach for achieving this, is programatically replacing the url with a `window` method while triggering an event we can subscribe to and re-render accordingly:

```ts

const EVENTS = {
    PUSHSTATE: 'pushstate',
}

const dispatchPushStateEvent = (href: string) => {
  window.history.pushState({}, '', href);
  const navigationEvent = new Event(EVENTS.PUSHSTATE);
  window.dispatchEvent(navigationEvent);
};
```

The `window.history.pushState` method adds an entry to the browser's session history stack, allowing us to replace the url without refreshing the page. 

At the same time, since this method doesn't trigger any events we can listen to, we can dispatch a custom `pushstate` event and subscribe to it in a `useEffect`. For this purpose, we will refactor a bit the `App.tsx`:

```tsx
// App.tsx

/*
{... same as before ...}
*/

const getCurrentPath = () => window.location.pathname;

function App() {
  const [currentPathname, setCurrentPathname] = useState(getCurrentPath());

  useEffect(() => {
    const onLocationChange = () => setCurrentPathname(getCurrentPath());
 
    window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
    
    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
    };
    }, [])

    const Page = routes.find((route) => route.path === currentPathname)?.element
    return (
      <main>
        {Page ? Page : 404Page}
      </main>
    )
}

```

## Link component: Replacing anchor's default behavior

Now we can use the `dispatchPushStateEvent` function in the anchor element. For this, we can create a custom `Link` component that will return a traditional anchor element but with the altered functionality:

```tsx
// Link.tsx
import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { dispatchPushStateEvent } from './utils';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

function Link({ target, to, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent) => {
    const isMainEvent = event.button === 0; // primary mouse button click
    const isModifiedEvent =
      event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    
    // let browser handle target="_blank" etc
    const isManageableEvent = target === undefined || target === '_self'; 
    
    if (isMainEvent && isManageableEvent && !isModifiedEvent) {
      event.preventDefault();
      dispatchPushStateEvent(to);
    }
  };

  return <a onClick={handleClick} href={to} target={target} {...props} />;
}

export default Link
```

What we are doing here is that clicking on the anchor will trigger our custom `pushstate` event, as long as the intent is not opening a new window or tab (hence the `isModifiedEvent` and `isMnageableEvent`).

We can now refactor our routes with the new Link component:

```tsx
const routes = [
    {
        path: '/',
        element: (
            <div>
                <h1>Hello World!</h1>
                <Link to="/about">About us</Link>
            </div>
        ),
    },
    {
        path: '/about',
        element: (
            <div>
                <h1>About us</h1>
                <Link to="/">Go back home</Link>
            </div>
        ),
    },
]

```

If you try now to inspect the network requests, you'll see that after the initial load there won't be any more requests to the server while navigating across the pages. First goal for building the router achieved!

Now there is a prooblem though, if you try to navigate back using the browser back button you will see that the page content doesn't update. This is because the current location in our SPA is not being updated.

## Updating the location when navigating back

In order to update the current route when the user tries to navigate back, we are going to need to update the `useEffect` where we handled our custom `pushstate` event.  This time we need to add a subscription to the `popstate` event, which is automatically triggered when we click the back button (or when calling `window.back`):

```tsx
const [currentPathname, setCurrentPathname] = useState(getCurrentPath());

useEffect(() => {
  window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
  window.addEventListener(EVENTS.POPSTATE, onLocationChange);
  return () => {
    window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange);
    window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
  };
}, []);
  ```

And with this we have a working router for our SPAs!

## Routes with dynamic segments

So far we have added support for routes with static names (like `/about` for example). However, in most cases we are going to need routes with* dynamic segments (for example `/user/:id`). 

In order to support his, we will use the library **path-to-regexp** and replace in `App.tsx` this line where we check for equal path names:

```ts
const page = routes.find((route) => route.path === currentPathname)?.element
```

With this one:

```ts
import { match } from 'path-to-regexp';

const page = routesToUse.find(({ path }) => {
    if (path === currentPathname) {
      return true;
    }

    const matcherUrl = match(path, { decode: decodeURIComponent });

    const matched = matcherUrl(currentLocation.path);
    if (!matched) return false;

    return true;
  })?.element;
```

## Query parameters

Additionaly, it will be useful if our router also had access to the query parameters and re-render

## The router context provider

Now that we have the basic functionality of the routing in place, we can extract this logic into a React context so we can also consume the router state in any component of the application. Let's start by creating the context:

```tsx
// context.ts
import { createContext, useContext } from 'react';

interface RouterContext {
  pathname: string;
  navigate: (to: string) => void;
}

export const RouterContext = createContext<RouterContext>(null!);

export function useRouter() {
  return useContext(RouterContext);
}
```

Now we can create a Router component that returns this context:
```tsx

```



We have now the foundation 

## Extra: Optimizing bundle size

