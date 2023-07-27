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
Single-Page Applications (SPA) are really popular specially in highly interactive applications. This is because an SPA consists of a single JavaScript application that generates the html without ever hitting the server (except for the first load) and lets the application maintain state and memory across multiple pages, also allowing for seamless transitions.

In this kind of applications, there is a router running on the client which plays an essential role since it prevents the client from requesting any new page to the server and instead letting the JavaScript application generate the corresponding page.

Inspired by [this exceptional video by midudev](https://www.youtube.com/watch?v=K2NcGYajvY4) (in Spanish) and in order to understand how routing in SPAs work, I made my own router in React and Typescript using as reference the source code of the popular React Router. However, I simplified it to the bare minimum just implementing the essential client routing.

## The Link component

## The Router

## The Route

