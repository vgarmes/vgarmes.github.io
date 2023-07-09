---
layout: ../../layouts/post.astro
title: 'Set up a delightful PowerShell prompt with Oh My Posh'
pubDate: 2023-06-26
description: 'In this step-by-step guide I explain the process I followed to customize the command prompt for a joyful and efficient development experience using Windows Terminal and Powershell'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1687710296/blog/ohmyposh_jwhrvk.webp' 
    alt: 'Custom command prompt with Powershell'
tags: ["shell", "powershell", "oh my posh"]
draft: false
---
For some time I've been wanting to customize my terminal for not only making it look nicer but also for getting the most out of it. But every time I set out to do it, I'd get caught up in building projects. However, watching people like [Takuya Matsuyama (@craftzdog)](https://www.youtube.com/@devaslife) code with their epic setup, encouraged me to finally take the plunge.

With just a few small tweaks using PowerShell and tools like Oh My Posh, I was able to take the command prompt in my Windows machine to a whole new level with the following features:

1. Personalized command prompt theme: customize colors, text font and icons.
2. Git branch information displayed in the prompt
3. Alisases
4. Command-line tab auto-completion and command history
5. Directory jumping
6. Custom functions

And here is a small peak of what it looks like:

![Custom command prompt with Powershell](https://res.cloudinary.com/dx73a1lse/image/upload/v1687710296/blog/ohmyposh_jwhrvk.webp)

I'm really happy with the result and I can already notice how much more enjoyable and effective the overall experience of using the terminal is. In this post I'll walk you trough the process I followed to setup these tools.

---

## Install Powershell and configure Windows Terminal

PowerShell is a versatile command-line shell language developed by Microsoft and it provides a robust environment where it is really easy to automate workflows.

The easiest way to get Powershell running in your machine is installing it directly from the Microsoft Store.

Once you have Powershell installed, change Windows Terminal's default shell to Powershell.

## Install a Nerd Font

The custom themes we are going to install in the next steps use glyphs (icons) for styling the command prompt. To ensure that we see all of the glyphs in the terminal, it is recommended to install a [Nerd Font](https://www.nerdfonts.com/).

Find a font of your preference (I chose *Hack*) and after downloading it, unzip it and install it (right click on the file and click on *Install*).

Open the Windows Terminal **Settings**, select the Powershell profile and then the **Appearance** tab. In the **Font face** drop-down menu, select the font you just installed.

![Appearance tab of Powershell profile in Windows terminal](https://res.cloudinary.com/dx73a1lse/image/upload/v1686473655/blog/color-scheme_nlqocv.png)

## Change the color scheme

In **Appearance** tab, you can also change the color scheme. I used *One Half Dark*, choose whichever you prefer. 

Depending on your preferences, you might also want to make the background of your terminal translucent. For doing so, you can find the **Transparency** settings in the same tab. 

Try tweaking the values for **Background opacity** and switching on and off the **Enable acrylic material** toggle until you find the configuration that appeals to you. I left the opacity at 90% and enabled acrylic material.

![Transparency settings of Windows Terminal](https://res.cloudinary.com/dx73a1lse/image/upload/v1686473654/blog/background-opacity_got3cp.png)

## Create a Powershell profile

The rest of the configuration is defined in a PowerShell profile. This file is basically a script that runs when PowerShell starts and it can contain commands, aliases, functions, variables, modules, etc.

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

The next steps will basically consist in configuring the PowerShell environment by adding commands to the profile. You can check [my personal profile](https://github.com/vgarmes/dotfiles/blob/main/.config/powershell/user_profile.ps1) to have an idea of what this file will look like after following the configuration steps below and to make it easier to follow along this guide. 

## Set some aliases

Aliases are essentially shortcuts that map one command to another. They can save you from having to type long commands or from having to remember commands that do the same but are called differently accross different OS environments. 

Creating aliases in PowerShell is very straight forward with the `Set-Alias`  cmdlet (cmdlets are Powershell commands). The syntax is:

```ps1
Set-Alias {command name} {command to run}
```

For example, a useful alias for users of Unix-like operating systems is mapping `ls` to `ll`, since the former will prompt a list of files in a similar fashion as the `ll` Unix command. We just need to add the following line to our profile:

```ps1
Set-Alias ll ls
```

Now it's a good time to test out that you implemented the previous sep correctly and PowerShell is using your profile file. Simply type the alias on the command prompt, if it does the expected that means your profile has been correctly configured.

## Install posh-git

The first module we can start installing is posh-git. This module integrates Git and Powershell by providing Git status summary information that can be displayed in the PowerShell prompt.

posh-git can be installed from the Powershell gallery:

```ps1
Install-Module posh-git -Scope CurrentUser -Force
```

**Tip:** A useful command to see the modules you have installed at any time is:
```ps1
Get-InstalledModule
```

## Install Oh My Posh

On the other hand, Oh My Posh is a highly customizable prompt framework for PowerShell that allows us to create visually appealing and informative prompts, enhancing our command-line interface with colors, icons and various useful information.

Oh My Posh enables you to to use the full color set to change the appearance of the commpand prompt by creating your own theme or use one from their extensive library.

Oh My Posh can be installed using **winget**:

```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

**Tip:** if you need to update Oh My Posh, simply run the command:
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

## Install icons

One of the first visual enhancement we can take advantage of by using Oh My Posh is having icons that represent the file type next to the file names when listing a directory. We can add the icons by installing **Terminal-Icons**:

```ps1
Install-Module -Name Terminal-Icons -Repository PSGallery
```

And import it in your Powershell profile:
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

## Configure PSReadLine

PSreadline is a module that is already installed with Powershell by default and lets us configure the behavior of the command line editing. I find particularly useful the predictive IntelliSense which enable predictions of commands as you type. To enable this you just need to add the following to your profile:

```ps1
Set-PSReadLineOption -PredictionSource History
```

You can configure further how you want PSreadline to show the predictions. By default you'll just see them on the same line where you type, but you can also enable showing them as a list with the following configuration:

```ps1
Set-PSReadLineOption -PredictionViewStyle ListView
```

Another cool feature of PSReadLine is that you can change the key bindings. For example, if you want to emulate Bash or Emacs key bindings you can add the following line:

```ps1
Set-PSReadLineOption -EditMode Emacs
```

## Add custom functions
Finally, one of my favorite features of PowerShell, is that it enables the possibility of easily adding custom functions.

The options here are infinite. Just to give you an example, a function that I find myself using very often, specially when working on collaborative projects, is deleting git branches that match a pattern. For example, I might have several branches that include the word `fix` and I don't longer need and I'd like to delete them all at once. A function that could automate that is the following:

```ps1
function delete-branches ($pattern) {
	git branch | Select-String -Pattern "$pattern" | ForEach-Object {
		git branch -D $_.ToString().Trim()
	}
}
```

## Conclusion

