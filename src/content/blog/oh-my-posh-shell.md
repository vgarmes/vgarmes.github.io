---
layout: ../../layouts/post.astro
title: 'Set up a delightful PowerShell prompt with Oh My Posh'
pubDate: 2023-05-06
description: 'In this step-by-step guide I explain the process I followed to customize the command prompt for a joyful and efficient development experience using Windows Terminal and Powershell'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1687710296/blog/ohmyposh_jwhrvk.webp' 
    alt: 'Custom command prompt with Powershell'
tags: ["shell", "powershell", "oh my posh"]
draft: false
---
Recently, on the lookout for a quick win to boost my development productivity, I customized the command prompt on my Windows machine. With just a few small tweaks in Windows Terminal and PowerShell, I was able to quickly create a personalized workspace that not only looks sleek but also helps me develop more efficiently.

In this step-by-step guide I explain the process I followed to do it. As a reference, I used [Takuya Matsuyama's (@craftzdog) setup](https://www.youtube.com/@devaslife), which I'm always impressed by when I watch his videos. Some of the main features of this setup include:

1. Personalized color themes and fonts.
2. Git branch information displayed in the prompt
3. Alisases
4. Tab auto-completion and command history
5. Directory jumping
6. Custom functions

![Custom command prompt with Powershell](https://res.cloudinary.com/dx73a1lse/image/upload/v1687710296/blog/ohmyposh_jwhrvk.webp)

---

## Install Powershell and configure Windows Terminal

The easiest way to get Powershell running in your machine is installing it directly from the Microsoft Store.

Once you have Powershell installed, we need to change Windows Terminal's default shell to Powershell

## Install a Nerd Font

The custom themes we are going to install in the next steps use glyphs (icons) for styling the command prompt. To ensure that we see all of the glyphs in the terminal, it is recommended to install a [Nerd Font](https://www.nerdfonts.com/).

Find a font of your preference (I chose *Hack*) and after downloading it, unzip it and install it (right click on the file and click on *Install*).

Open the Windows Terminal **Settings**, select the Powershell profile and then the **Appearance** tab. In the **Font face** drop-down menu, select the font you just installed.

![Appearance tab of Powershell profile in Windows terminal](https://res.cloudinary.com/dx73a1lse/image/upload/v1686473655/blog/color-scheme_nlqocv.png)

## Change the color scheme

Also, in **Appearance** tab, you can change the color scheme. Choose whichever you prefer. I used *One Half Dark*.

Depending on your preferences, you might also want to make the background of your terminal translucent. For doing so, you can find the **Transparency** settings in the same tab. 

Try tweaking the values for **Background opacity** and switching on and off the **Enable acrylic material** toggle until you find the configuration that appeals to you. I left the opacity at 90% and enabled acrylic material.

![Transparency settings of Windows Terminal](https://res.cloudinary.com/dx73a1lse/image/upload/v1686473654/blog/background-opacity_got3cp.png)

## Create a Powershell profile

The rest of the configuration is defined in a Powershell profile. This file is basically a script that runs when Powershell starts and it can contain commands, aliases, functions, variables, modules, etc.

The `$PROFILE` variable stores the path to the PowerShell profile for the current user and current host. If you installed PowerShell for the first time, you most likely don't have this directory on your computer. In any case, to create it without any risk of overwriting an existing profile, use the following command:

```ps1
if (!(Test-Path -Path $PROFILE)) {
  New-Item -ItemType File -Path $PROFILE -Force
}
```

Then you can edit your profile using your preferred text editor. In my case, it's Neovim, but you can also use Notepad, for example (just replace nvim with notepad):

```shell
nvim $PROFILE
```

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

**Tip:**: A useful command to see the modules you have installed at any time is:
```ps1
Get-InstalledModule
```

## Install Oh My Posh

One of the most important steps for customizing the terminal is installing Oh My Posh. Oh My Posh enables you to use the full color set to define and render the prompt by easily creating your own theme or using one from their extensive library.

Oh My Posh can be installed using **winget**:

```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

**Tip**: if you need to update Oh My Posh, simply run the command:
```shell
winget upgrade JanDeDobbeleer.OhMyPosh -s winget
```

After this step you will need to restart the terminal and then add the initialization of Oh My Posh in your profile:

```
Oh My Posh init pwsh | Invoke-Expression
```

### Add a theme to Oh My Posh
In order to use a theme, you can add the following command to your Powershell script, replacing `POSH_THEMES_PATH` by your theme of preference:

```ps1
Oh My Posh init pwsh --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression
```

## Install icons:

One of the first visual enhancement we can take advantage of by using Oh My Posh is having icons that represent the file type next to the file names when listing a directory because it allows us to quickly identify them. We can add the icons by installing **Terminal-Icons**:

```ps1
Install-Module -Name Terminal-Icons -Repository PSGallery
```

Add import it in your Powershell profile:
```ps1
Import-Module -Name Terminal-Icons
```

## Install z (directory jumping)

**z** is a really useful module that lets you quickly navigate the file system based on your command history. The way it works is that by just typing in the command prompt `z` followed by a keyword, **z** will search in your command history for the closest match and "cd" into it.

For example, if you have previosly navigated into the directory `C:\Users\Victor\dev\homepage` and you type `z homepage`, **z** will automatically navigate you to that directory.

To install **z**, run the following command:
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
