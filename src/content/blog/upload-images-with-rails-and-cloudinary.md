---
layout: ../../layouts/post.astro
title: 'Upload images with your Rails app using Active Storage and Cloudinary'
pubDate: 2020-12-08
description: 'Setting up Active Storage in your Rails app for being able to upload images to cloud storage service can be a bit challenging the first time.'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["ruby", "rails"]
draft: false
---
***Archived post. Originally posted on [my blog in Medium](https://medium.com/@vgmestre/upload-images-with-your-rails-app-using-active-storage-and-cloudinary-ecf31c5ba999)***

One of the first issues I encountered when deploying to production a Rails app that used Active Storage, is that I could no longer use its default local storage configuration as I did in the development environment. For example, if you are using a host like Heroku to deploy your app with Active Storage’s default setup, the images you upload will be stored only temporarily in Heroku’s filesystem.

Luckily, Active Storage supports uploading files to a cloud storage service like Amazon S3, Google Cloud Storage, Microsoft Azure Storage or, in my case, Cloudinary. Services like Amazon S3 are widely used, but they have the inconvenience that, even with access to a free quota, you have to provide credit card details and are exposed to unexpected charges if you exceed the quota accidentally. Considering I was setting this up for some hobby projects, I didn't like the idea of facing a huge bill for accidentally overusing my cloud storage, [like that story of a guy who got a bill of $2700](https://chrisshort.net/the-aws-bill-heard-around-the-world/).

That's when I discovered [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/vn6ewqntof8rnbjaoypb?t=default). Cloudinary is a cloud storage service that offers a free plan, requiring no credit card, and allows storage of up to 25GB of data or 25GB of viewing bandwidth. Moreover, it has a Gem that simplifies integration with any Rails app. This covered all my needs, so I went ahead.

## Install Cloudinary's gem

To set up Cloudinary in your Rails app, first [create a free account on their website](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/vn6ewqntof8rnbjaoypb?t=default). Then, as with any other Rails gem, add it to your Gemfile:

```ruby
gem 'cloudinary'
```

and run:
```ruby
bundle install
```

## Set up your Cloudinary credentials
The next step is to add your Cloudinary credentials. You can find these in the `cloudinary.yml` file, which you can download from your Cloudinary dashboard. As with any other credentials, it is good practice to store them in a configuration file outside of Git while adding them to your environment variables.

In order to do this, if you are running the app locally, you can use a Gem called Figaro. Once installed, Figaro creates a `config/application.yml` file and adds it to your .gitignore. Therefore, in your `config/application.yml`, add your credentials as in the example below:

```ruby
development:
 cloud_name: mycloud
 api_key: '123456789'
 api_secret: qwerty123uiop456
 enhance_image_tag: 'true'
 static_file_support: 'false'
production:
 cloud_name: mycloud
 api_key: '123456789'
 api_secret: qwerty123uiop456
 enhance_image_tag: 'true'
 static_file_support: 'true'
test:
 cloud_name: mycloud
 api_key: '123456789'
 api_secret: qwerty123uiop456
 enhance_image_tag: 'true'
 static_file_support: 'false'
```

Then, Figaro will parse this YAML file and load all the values into ENV.

However, when deploying the app to production, you will have to do this in a different way depending on the service you are using. For example, in Heroku you will have to [add the credentials to your config vars](https://devcenter.heroku.com/articles/config-vars). You can easily do this from your Heroku dashboard, just remember to write the variable names in upper case (API_KEY, API_SECRET, CLOUD_NAME, etc).

## Configure Active Storage
Next is to set up Active Storage to work with Cloudinary. First you will have to declare the service in the config/storage.yml file:

```ruby
cloudinary:
 service: Cloudinary
 ```

 Then configure Active Storage in the `config/environments/production.rb` file commenting out the default local setup:

 ```ruby
 config.active_storage.service = :cloudinary
#config.active_storage.service = :local
```

This will change your production environment setup. If you are going to use Cloudinary in your development and test environments as well, just do the same in the corresponding development.rb and test.rb files.

In order to upload images to a cloud storage service, Active Storage will have to upload directly from the client to the cloud. This functionality is called Direct Uploads and it has to be included in your application’s JavaScript bundle.

If you are using an old version of Rails (5 or below) you will have to do this using the asset pipeline by adding the following line in app/assets/javascripts/application.js :

```ruby
//= require activestorage
```

However, this is not relevant to new Rails 6 applications where Webpack is used. Instead you will have to use the npm package including the following line in app/javascript/packs/application.js :

```ruby
require("@rails/activestorage").start()
```

## Uploading and displaying images

Now you are able to upload images using Rails forms like in the example below:

```ruby
<%= form_for @book do |f| %>
<%= f.file_field :cover, class: 'form-control', direct_upload: true %>
<%= f.button :submit, class:"button is-dark" %>
<% end %>
```

When displaying images from the cloud, you can still use the image_tag method as usual:

```ruby
<%= image_tag @book.cover, alt: "#{@book.title}" %>
```
