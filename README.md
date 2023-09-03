# My homepage

Built with Astro and Preact for a blazingly fast website 🚀

## Installation

```
yarn
```

## Some considerations with Astro

### Linter

This project uses ESLint together with `eslint-plugin-astro`, [a community mantained plugin](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/).

### Code formatter

Formatting is done with Prettier together with [the official Astro plugin](https://github.com/withastro/prettier-plugin-astro/blob/main/README.md).

If you use VSCode, you will need to first install the VS Code Prettier extension and add the following settings to your VS Code configuration so VS Code is aware that Prettier can be used for Astro files:

```
{
  "prettier.documentSelectors": ["**/*.astro"]
}
```

Additionally, you should set Prettier as the default formatter for Astro files or VS Code will ask you to choose a formatter everytime you format since the Astro VS Code extension also includes a formatter for Astro files:

```
{
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## API

This website uses Clodflare Workers for the API and Cloudflare D1 for the database. The worker is using Hono and Drizzle ORM.

## Cloudflare D1 database

`drizzle-kit drop`: if necessary, delete a migration file

To init local database and run server locally

```
wrangler d1 execute <DATABASE_NAME> --local --file=./drizzle/{MIGRATION_FILE_NAME}.sql
wrangler dev --local --persist
```

Schema updates:
Whenever you apply changes to the schema - you just rerun `yarn generate` and it will generate SQL migration for you completely automatically in most of the cases

Maintain stale metadata
We're rapidly evolving Drizzle Kit APIs and from time to time there's a need to upgrade underlying metadata structure.
drizzle-kit up:{dialect} is a utility command to keep all metadata up to date.
