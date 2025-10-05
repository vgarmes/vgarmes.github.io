---
title: 'My Mac terminal setup in 2025'
pubDate: 2025-10-05
description: 'A minimal, fast terminal setup with Ghostty.'
tags: ['terminal', 'productivity']
draft: false
---

I recently set up my new MacBook Pro M3 from scratch, and this time I decided to try a new terminal emulator.

In the past I've used mostly iTerm 2. This time I wanted to try Ghostty because I've seen it performs very well in performance benchmarks and I liked their zero-configuration philosophy. It also comes built-in with some features like Nerd Fonts and the option to split the screen.

Today, I'll share my configuration, not only for anyone who might find it useful, but also as a reference for myself when I need to set up a new machine.

## Installing Ghostty and and Creating a Config File

First, download and install Ghostty. You can do this either through the binary file or using Homebrew. I went with the binary installation.

Once installed, create a config file at `$HOME/.config/ghostty/config`. Ghostty will load this automatically. This file uses a simple `key = value` syntax. Here's my configuration:

```
font-family = Geist Mono
font-size = 16
background-opacity = 0.9
theme = Vesper
```

As you can see, I went with the Vesper theme and Geist Mono font, both built-in. You can browse all available themes by simply running:

```bash
 ghostty +list-themes
```

## Install Powerlevel10k

Powerlevel10k is a highly customizable theme for Zsh where you can change what the command prompt looks like.

To install it with Homebrew:

```bash
brew install powerlevel10k
```

Then add it to the `~/.zshrc` to enable it:

```bash
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >> ~/.zshrc
```

Now source your `~/.zshrc`, which will automatically trigger the configuration wizard (or run `p10k configure` manually):


```bash
source ~/.zshrc
```

## Auto-suggestions

The zsh-autosuggestions plugin provides autocompletion functionality. As you type a command, it suggests commands you've used in the past. To accept a suggestion, just press the right arrow key.

Install it with Homebrew:

```bash
brew install zsh-autosuggestions
```

Add it to your `~/.zshrc`:

```bash
echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc
```

## Install eza 

eza is a modern replacement for `ls` with better defaults, colors, and icon support.

Install it with: 

```bash
brew install eza
```

Then you can replace the default `ls` command by adding an alias to your `~/.zshrc`:

```bash
alias ls="eza --icons=always"
```

## Install zoxide

zoxide is a smarter alternative to `cd`. Instead of typing the full path to a directory you've visited before, you can just type part of its name.

Install it with:

```bash
brew install zoxide
```

And add it to the `~/.zhsrc`

```bash
eval "$(zoxide init zsh)"
```

Now, for example, if you've previously navigated to `~/projects/foo/bar`, you can jump there from anywhere by typing `z bar`

## Wrapping up

With these tools configured, you have a fast, beautiful, and productive terminal setup. The best part? Everything here works out of the box with minimal configuration.

If you found this helpful or have suggestions for other tools I should try, feel free to reach out!