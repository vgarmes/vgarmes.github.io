---
layout: ../../layouts/post.astro
title: 'Upload images with your Rails app using Active Storage and Cloudinary'
pubDate: 2020-12-08
description: 'This is the first post of my new Astro blog.'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["astro", "blogging", "learning in public"]
draft: true
---
***Originally posted on [my blog in Medium](https://medium.com/@vgmestre/upload-images-with-your-rails-app-using-active-storage-and-cloudinary-ecf31c5ba999)***

One of the first issues I encountered when deploying my Rails apps to production is that I could no longer store images locally as I was doing in the development environment. For example, if you are using Heroku to deploy your app with Active Storage’s default local storage setup, the images you upload will be stored only temporarily in Heroku’s filesystem.

Luckily, Active Storage supports uploading files to a cloud storage service like Amazon S3, Google Cloud Storage, Microsoft Azure Storage or, like in this case, Cloudinary. Services like Amazon S3 are widely used but they have the inconvenient that, even if you have access to a free quota, you have to fill in your credit card details and get exposed to unexpected charges if you accidentally exceed such quota. As a beginner developer who just wanted to have his personal projects deployed to production, I didn’t like the idea of making a mistake or even being hacked with the consequences of receiving a huge bill for overusing my cloud storage, [like that story of a guy who got a bill of $2700](https://chrisshort.net/the-aws-bill-heard-around-the-world/).

This is when I learned about [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/vn6ewqntof8rnbjaoypb?t=default). Cloudinary is a cloud storage service that has a free plan which does not require credit card and allows to store up to 25GB of data or 25GB of viewing bandwidth. Moreover, it has a gem that simplifies the integration with any Rails app. This covered all my needs, so I went ahead.

In order to set up Cloudinary in your Rails app, first [create a free account on their website](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/vn6ewqntof8rnbjaoypb?t=default). Then, as usual with any other Rails gem, add it to your Gemfile:

```rails
gem 'cloudinary'
```

and run:
```rails
bundle install
```

Next step is adding your Cloudinary’s credentials. You can see these if you download the `cloudinary.yml` file from your Cloudinary dashboard. As with any other credentials, it is good practice to store them in a configuration file out of Git while adding them to your environment variables.

In order to do this, if you are running the app locally, you can use a gem called Figaro. Once installed, Figaro creates a config/application.yml file and adds it to your .gitignore. Therefore, in your config/application.yml, add your credentials as in the example below: