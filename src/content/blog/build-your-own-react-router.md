---
layout: ../../layouts/post.astro
title: 'Build your own React router: A dive into Single-Page Applications'
pubDate: 2023-08-03
description: 'The core of Single-Page Applications consists of its client routing which allows navigating through the pages without hitting the server. I made a basic React router to better understand this behavior.'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1689889088/blog/overview_ugl3u2.webp' 
    alt: 'Custom command prompt with Powershell'
tags: ["react", "router", "spa"]
draft: false
---
Single-Page Applications (SPAs) are really popular, especially for highly interactive applications. Frameworks like Next.js, SvelteKit, and Remix are all examples of SPA frameworks, even though some of them offer server-side rendering capabilities. 

The key feature of SPAs is that they consist of a single JavaScript application, which generates the HTML of every page after the initial load without the need to hit the server again. This allows the application to maintain state and memory across pages seamlessly. 

At the core of these applications, there lies a router running on the client-side. This router is what prevents the client from requesting new pages from the server and instead lets the JavaScript application generate the corresponding page.

To gain a better understanding of how routing in SPAs works, I decided to create my own router using React and TypeScript. I found great inspiration from [video by midudev](https://www.youtube.com/watch?v=K2NcGYajvY4) (in Spanish) where he builds something similar. Additionally, I referred to the source code of the popular library [React Router]() for guidance during the development process. 

You can see the router in action [here](https://v-router.netlify.app/)! Throughout this tutorial, I have prioritized simplicity while implementing only the essential features. Despite its simplicity, the router fully supports dynamic routing and query parameters. Now, let's delve into how we can build it.

## Getting started

As a foundation to test the router, I created an appication using [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) with the React and Typescript + SWC template.

In line with most typical React-based SPAs, this template generates an almost empty index.html file containing a root `<div>` element. Additionally, a JavaScript file (in this case, written in TypeScript) is included, where React will inject the rendered HTML into this root element:

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

Following a similar approach to React Router, we'll implement a Router component that accepts the routes as props. Thus, we can begin by creating the routes object and making an initial attempt at conditionally rendering the corresponding route based on the current location:

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

The implemented routing logic will successfully find a matching route and render the corresponding page; otherwise, it will display a 404 page. 

However, when attempting to navigate between the root page `/` and `/about` using the links provided, you will notice that every time you navigate to page, a request is sent to the server to fetch the corresponding HTML file and the entire JavaScript application (you can see it on the Network tab of the browser developer tools). 

To achieve true SPA behavior, we need to avoid this and intercept all navigation attempts.

## Intercepting navigation

To intercept all navigation attempts and prevent the browser's default behavior, we need to take the following steps:

1. Create a function that we can call in an anchor element (and elsewhere) to enable navigation to a different page.
2. Intercept the event of navigating back using the browser's back button.

### Creating a function to navigate to another path

First and foremost, we require a function that we can call whenever we need to navigate to a different page. The approach to achieve this involves programmatically replacing the URL using a `window` method while simultaneously triggering an event that we can subscribe to and handle the re-rendering process accordingly:

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

The `window.history.pushState` method is used to add an entry to the browser's session history stack, enabling us to replace the URL without the need to refresh the page.

At the same time, since this method doesn't trigger any events we can subscribe to, we can dispatch a custom `pushstate` event and subscribe to it in a `useEffect` hook. For this purpose, we will need to make some refinements to the `App.tsx` file:

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

Now we can use the `dispatchPushStateEvent` function in the anchor element. For this, we can create a custom `Link` component that will return a traditional anchor element but with the modified functionality:

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

What we are accomplishing here is that clicking on the anchor will trigger our custom `pushState` event, but only if the intent is not to open a new window or tab (hence the `isModifiedEvent` and `isMnageableEvent` checks).

With the new `Link` component in place, we can now proceed to refactor the elements returned by our routes:

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

If you try inspecting the network requests now, you'll notice that after the initial load, there won't be any more requests to the server while navigating across the pages. We have achieved the first goal for building the router!

However, there is still an issue. If you attempt to navigate back using the browser's back button, you will notice that the page content doesn't update. This is because the current location in our SPA is not being updated.

### Updating the location when navigating back

To update the current route when the user navigates back, we'll need to make some changes to the  `useEffect` where we previously handled our custom `pushState` event. This time, we will add a subscription to the `popState` event, which is automatically triggered when the back button is clicked (or when `window.back` is called).:

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

Where we added the new event to the `EVENTS` object:

```ts
const EVENTS = {
  PUSHSTATE: 'pushstate',
  POPSTATE: 'popstate',
}
```

And with this, we have successfully built a working router for our SPAs!

## Adding support to dynamic routes and query parameters

### Dynamic routes

So far, we have added support for routes with static names (like `/about` for example). However, in most cases, we are going to need routes with dynamic segments (for example `/user/:id`). 

To support his, we will use the library **path-to-regexp** and replace this line in `App.tsx` where we check for equal path names:

```ts
const page = routes.find((route) => route.path === currentPathname)?.element
```

With this one:

```ts
import { match } from 'path-to-regexp';

let params: Record<string, string> = {};
let pathname: string = '';

const page = routesToUse.find(({ path }) => {
  if (path === currentPathname) {
    pathname = path;
    return true;
  }

  const matcherUrl = match(path, { decode: decodeURIComponent });

  const matched = matcherUrl(currentLocation.path);
  if (!matched) return false;

  params = matched.params as Record<string, string>;
  pathname = path;
  return true;
})?.element;
```

Where `params` will contain the values of the dynamic segments. For example, if the user is trying to access the route `/user/123`, this will match the route `/user/:id` and `params` will be an object with a value of `{id: '123'}`. We will also keep the value for the original path in `pathname` (in the previous example it would be `/user/:id`) since it might be useful.

### Query parameters

Additionally, we'll also need to support query parameters. For this, we can start by implementing a helper function that will get the query parammeters (also called search parameters) from the current location:

```ts
export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = {} as Record<string, string | string[]>;
  for (const [key, value] of searchParams.entries()) {
    if (!query[key]) {
      query[key] = value;
    } else if (typeof query[key] === 'string') {
      query[key] = [query[key] as string, value];
    } else {
      query[key] = [...query[key], value];
    }
  }
  return query;
};
```

This function will return an object whose values will be either a string or an array of strings, depending on whether the corresponding parameter key has multiple values or not. For example, a query parameter of `?foo=1&foo=2&bar=abc` will be parsed as `{ foo: ['1', '2'], bar: 'abc' }`.

Now, we can add this to the event subscription, so the application is re-rendered when there's a query change. For this purpose, I renamed the previous `currentPathname` to `currentLocation`, which will contain both the current path and query:

```ts
const [currentLocation, setCurrentLocation] = useState({
  path: getCurrentPath(),
  query: getQueryParams(),
});

useEffect(() => {
  const onLocationChange = () =>
    setCurrentLocation({
      path: getCurrentPath(),
      query: getQueryParams(),
    });
  window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
  window.addEventListener(EVENTS.POPSTATE, onLocationChange);
  return () => {
    window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange);
    window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
  };
}, []);
```

### Refactoring the navigation

These additions will allow our application to render the right route when the requested url contains dynamic segments and also keep in the state the query parameters. 

However, if we want to link to a dynamic route or add query parameters to a link programatically, we'll need to refactor our `Link` component so it's able to link to an `href` given any values of path, dynamic segments and query parameters. The function to do this conversion would be something like this:

```ts
import { compile } from 'path-to-regexp';

const compilePathWithSegments = (
  pathname: string,
  segments: Record<string, string>
) => {
  const toPath = compile(pathname, { encode: encodeURIComponent });
  return toPath(segments);
};

export type PathObject = {
  pathname: string;
  pathSegments?: Record<string, string>;
  query?: Record<string, string | string[]>;
};

export function getRelativeHref(url: string | PathObject) {
  if (typeof url === 'string') {
    return url;
  }
  if (!url.pathname) {
    return '';
  }

  let compiledPathname = url.pathname;
  if (url.pathSegments) {
    compiledPathname = compilePathWithSegments(url.pathname, url.pathSegments);
  }

  const searchParams = new URLSearchParams();
  if (url.query) {
    Object.entries(url.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchParams.append(key, value);
      } else {
        value.forEach((val) => searchParams.append(key, val));
      }
    });
  }
  return searchParams.toString()
    ? `${compiledPathname}?${searchParams}`
    : compiledPathname;
}
```

The function `getRelativeHref` will accept a URL as a string, for example `/about`. Alternatively, the url can also be passed as an object containing its pathname and, optionally, its dynamic segments and query parameters. For example: `{ pathname: '/user/:id', pathSegments: { id: 'foo' }, query: { search: 'bar' }}`.

Then we can add this functionality to the `Link` component:

```tsx
// Link.tsx
function Link({ target, to, ...props }: LinkProps) {
  const href = getRelativeHref(to);
  const handleClick = (event: MouseEvent) => {

    // {... same as before ...}

    if (isMainEvent && isManageableEvent && !isModifiedEvent) {
      event.preventDefault();
      dispatchPushStateEvent(href);
    }
  };

  return <a onClick={handleClick} href={href} target={target} {...props} />;
}
```

## The router context provider

Now that we have all the basic functionality of the routing in place, we can extract this logic into a React context so we can consume the routing state in any component of the application. 

Let's start by creating the context:

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
// Router.tsx

function navigate(to: string | PathObject) {
  const href = getRelativeHref(to);
  dispatchPushStateEvent(href);
}

function Router({
  routes = [],
  defaultElement = <h1>404</h1>,
}: PropsWithChildren<Props>) {
  /* 
  const [currentLocation, setCurrentLocation] = useState({ ...

  useEffect(() => { ...

  let params: Record<string, string> = {};
  let pathname: string = '';

  const page = routes.find(({ path })) => { ...
  */

  return (
      <RouterContext.Provider
        value={{
          pathname,
          asPath: currentLocation.path,
          params,
          query: currentLocation.query,
          navigate,
        }}
      >
        {page ? page : defaultElement}
      </RouterContext.Provider>
    );
```
## Taking it a bit further: the Route component

In order to reduce the level of abstraction, we can define a custom `Route` component, similar to the equivalent component in React Router. This allows us to use the `Route` component for each individual route instead of passing a `routes` object to the `Router`:

```tsx
function App() {
  // ...
  return (
    <Router>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Router>
  )
}
```

This custom `Route` component, similary to the component in React Router, simply returns null:

```tsx
// Route.tsx

import { ReactNode } from 'react';

export interface RouteProps {
  path: string;
  element: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Route(_props: RouteProps) {
  return null;
}
```

(Notice that I added an eslint exception since we are not using the props.)

Then, React Router cleverly leverages the `React.Children` method, which is not commonly encouraged by [the React docs](https://react.dev/reference/react/Children) except for specific use cases like this. This method lets you transform the JSX code received as `children` prop. 

By doing this, we can map the `children` and extract the props of the corresponding routes. Then, the `Router` will render the element of the matching route as usual, effectively ignoring the children components:

```tsx
// Router.tsx
function Router({
  children,
  routes = [],
  defaultElement = <h1>404</h1>,
  basename = '',
}: PropsWithChildren<Props>) {
  // ... same code

  const routesFromChildren =
    Children.map(children, (child) => {
      const { props, type } = child as JSX.Element;
      const { displayName } = type;
      const isRoute = displayName === 'Route';

      return isRoute ? (props as RouteProps) : null;
    })?.filter(Boolean) || [];

  // we support both routes passed as an object ('routes' prop) or part of children as a <Route />
  const routesToUse = [...routes, ...routesFromChildren];

  const page = routesToUse.find(({ path }) => {
    // ... same code
  })
  /* 
  return (
    ... same code
  ) 
  */
```

## Optimizing for production: Lazy loading

As it is now, using this router in our SPA will load all the JavaScript code during the first request, which negatively impacts the application's initial load time. 

To optimize and load only the code required to run the current page, we should move the pages into their own files and lazy load them using  `React.Suspense`:

```tsx
import { Suspense, lazy } from 'react';
import { Router, Route } from './';
import Page404 from './pages/404';

const HomePage = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/About'));

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/',
    element: <AboutPage />,
  },
];

function App() {
  return (
    <main>
      <Suspense fallback={null}>
        <Router routes={routes} defaultElement={<Page404 />} />
      </Suspense>
    </main>
  );
}

export default App;
```

## Putting it all together

You can take a look at the final implementation [in my repository](https://github.com/vgarmes/v-router), which incorporates all the techniques we have discussed, along with some additional improvements.

In conclusion, developing this basic client-side router has given me a better high-level understanding of SPAs. I hope it proves to be useful to you as well. Thanks for reading!