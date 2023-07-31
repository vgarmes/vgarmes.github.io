---
layout: ../../layouts/post.astro
title: 'Build your own React router'
pubDate: 2023-07-19
description: 'The core of Single-Page Applications consists of its client routing which allows navigating through the pages without hitting the server. I made a basic React router to better understand this behavior.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1689889088/blog/overview_ugl3u2.webp' 
    alt: 'Custom command prompt with Powershell'
tags: ["react", "router", "spa"]
draft: false
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

In order to replace the anchor's default behavior, we can create a custom `Link` component that will return a traditional anchor element but with altered functionality.


`pushState` will change the url without refreshing the page.
'popstate' triggered when we click back button or call window.back

a way to see

## The Link component

## The Router

## The Route

how they work under the hood