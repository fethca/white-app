# White app

Blank application setup with dependencies and configurations up to date. It provides an express api setup,
database and redis connexions draft.

## Prerequisites

Before cloning the White app, ensure you have the following prerequisites met:

- Node.js installed on your system
- pnpm package manager installed

## How To

- Clone project
- Remove unecessary dependencies. For example: express, helmet, cors etc. aren't usefull if the app isn't an API
- Upgrade dependencies to lastest version `pnpm upgrade --latest`.
- Replace all `white-app` occurences in the project.
- Delete this how to section

# white-app

Define the app

## Prerequisites

Before installing white-app, ensure you have the following prerequisites met:

- Node.js installed on your system
- pnpm package manager installed

### Installation

To install the required node modules for Nova Boop, run the following command:

```sh
pnpm install
```

### Environment Setup

Create a `.env` file at the root directory of your project and include the following environment variables:

```
APP_STAGE=dev

```
