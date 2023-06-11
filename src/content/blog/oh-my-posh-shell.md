---
layout: ../../layouts/post.astro
title: 'Set up a delightful PowerShell prompt with Oh My Posh'
pubDate: 2023-05-06
description: 'This is the first post of my new Astro blog.'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["shell", "powershell", "oh my posh"]
draft: false
---

## Install Powershell and configure Windows Terminal
The easiest way to get Powershell running in your computer is installing it directly from the Microsoft Store.

Once you have Powershell installed, we need to change Windows Terminal's default shell to Powershell

## Fonts
Go to nerdfonts.com and find a font of your preference. I personally installed Hack.

## Create a Powershell profile
The rest of the configuration is defined in a Powershell profile. This file is basically a script that runs when Powershell starts and it can contain commands, aliases, functions, variables, modules, etc.

The `$PROFILE` variable sotres the path to the Powershell profile for the current user and current host. If you installed Powershell for the fist time, most probably you don't have this directoy in your computer. In order to create it without any risk of overwriting an existing profile, use the following command:

```ps1
if (!(Test-Path -Path $PROFILE)) {
  New-Item -ItemType File -Path $PROFILE -Force
}
```

Then you can edit your profile using your preferred text editor which in my case it's Neovim, but you can also use Notepad for example (just replace `nvim` by `notepad`):

```shell
nvim $PROFILE
```

However, in order to have more control over my configuration files, I prefer to create a separate file that will be later imported from `$PROFILE`. In my case I created the following directory in home directory (`Users/[username]`):

```shell
mkdir .config/powershell
```

Then `cd` into this directory and create and edit a Powershell user profile:

```shell
nvim user_profile.ps1
```

Then we need to import this file 





