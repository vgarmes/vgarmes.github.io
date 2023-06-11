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

## Optional
In order to have more control over your configuration files, it's preferable to create a separate file that will be later imported from `$PROFILE`. In my case I created the following directory in home directory (`Users/[username]`):

```shell
mkdir .config/powershell
```

Then `cd` into this directory and create and edit a Powershell user profile:

```shell
nvim user_profile.ps1
```

Then we need to import this file from `$PROFILE`:

```shell
nvim $PROFILE
```

Inside the profile import your external configuration file:

```ps1
. $env:USERPROFILE\.config\powershell\user_profile.ps1
```

## Install posh-git
The first module we can start installing is posh-git. This module integrates Git and Powershell by providing Git status summary information that can be displayed in the PowerShell prompt.

posh-git can be installed from the Powershell gallery:
```ps1
Install-Module posh-git -Scope CurrentUser -Force
```

Tip: if this is the first time you use Powershell, a useful command to see at any time the modules you have installed is:
```ps1
Get-InstalledModule
```

## Install oh-my-posh
```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

Tip: if you need to update oh-my-posh, simply run the command:
```shell
winget upgrade JanDeDobbeleer.OhMyPosh -s winget
```

After this step you will need to restart the terminal and then initialize oh-my-posh in your Powershell profile:

```
oh-my-posh init pwsh | Invoke-Expression
```

## Add a theme to oh-my-posh
In order to use a theme, you can add the following command to your Powershell script, replacing `POSH_THEMES_PATH` by your theme of preference:

```ps1
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression
```

## Install icons:
```ps1
Install-Module -Name Terminal-Icons -Repository PSGallery
```

Add import it from your Powershell profile:
```ps1
Import-Module -Name Terminal-Icons
```

## Install z (directory jumping)
```ps1
Install-Module -Name z
```

## Configure PSreadline
PSreadline is already installed with Powershell by default
Predictive IntelliSense is disabled by default. To enable predictions, just run the following command:
```ps1
Set-PSReadLineOption -PredictionSource History
```

## Bonus: delete git branches by pattern
```ps1
function delete-branches ($pattern) {
	git branch | Select-String -Pattern "$pattern" | ForEach-Object {
		git branch -D $_.ToString().Trim()
	}
}
```
