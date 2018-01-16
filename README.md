# React Native Apollo Example

## Setup

```bash
yarn install
yarn start
```

## Getting Started

Look at `App.js` to see the connecting code.

In `./src/resolvers.js` you can see how to write a GraphQL resolver.

The `./src/Home.js` component declares a query and uses the `@client` keyword
to tell Apollo that this query should be ran against local state and not sent
to the server.