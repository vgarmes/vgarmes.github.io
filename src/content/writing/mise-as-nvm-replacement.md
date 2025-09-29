---
title: "Switching from nvm to mise-en-place"
pubDate: 2025-09-29
description: 'Easily replace nvm with mise-en-place for Node.js management.'
tags: ["node","javascript","mise"]
draft: false
---

As a frontend engineer working primarily in the JavaScript ecosystem, I've relied on [nvm](https://github.com/nvm-sh/nvm) for years. It lets you run multiple versions of Node.js on your machine, which is essential when switching between projects with different Node requirements.

Recently, I discovered a new tool at work that I believe will replace nvm for me: [mise-en-place](https://mise.jdx.dev/) (or just "mise"). They describe themselves as the "front-end to your dev env" 🙌.

While nvm is Node-specific, mise is a universal version manager. With mise, you can manage not only Node.js, but also Bun, Deno, Go, Python, Rust, and more.

Version preferences are managed using a `mise.toml` file in each project, or a global `config.toml` file.

## Seting up mise

If you're on macOS, installation is simple with Homebrew:

```shell
brew install mise
```

If you use Zsh, initialize mise in your `.zshrc`:

```shell
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

Restart your terminal or run `source ~/.zshrc` to activate.

## Using mise as nvm replacement

If you want to use the latest LTS release of Node.js version globally by default, just run:
```shell
mise use -g node@lts
```

Otherwise, indicate the exact version you need.

This creates a `config.toml` in `~/.config/mise`: 
```toml
[tools]
node = "lts"
```

You may want to uninstall any previous version of Node.js you have, either from nvm or as a global package. After setup, running `which node` will show something like:

```shell
~/.local/share/mise/installs/node/24.9.0/bin/node
```
(the latest version of Node is 24.9.0 at the time of writing).

If a project requires a different version, for example Node 20, just add a `mise.toml` file in your project root:
```toml
[tools]
node = "20"
```

Then mise will automatically switch versions for you as soon as you enter the project directory. 

Moreover, if you already had a `.nvmrc` or `.node-version`, you don't even need to create this `mise.toml` file if you don't want to. Mise also supports these files out of the box, making it a true drop-in replacement for nvm.