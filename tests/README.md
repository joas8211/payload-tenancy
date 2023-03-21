# Testing

Tests are ran using Jest and Puppeteer. Run all tests by issuing command
`yarn test`.

## Types of tests

There are three types of tests. Different types of tests have different file
extensions.

- unit.test.ts - Tests code directly by importing it.
- admin.test.ts - Tests functionality as admin panel user through browser using
  Puppeteer.
- api.test.ts - Tests functionality as API client using Rest or GraphQL.

## Folder structure

Tests are structured so that the first folders are stages of the plugin's life
that are ordered by number prefix (eg. "0-configuration/"), and inner folders
are different scenarios at that stage.

## Server

Admin and API tests require payload.config.ts to exist in the same directory or
upper directory. It's used to initialize Payload application. Those tests get
global variables that can be used to interact with the server.

- `payloadUrl` - URL to the running HTTP server, eg. "http://127.0.0.1:1234"
  (note that port is not static).
- `payloadReset` - Reset Payload by removing all existing documents.

## Robot

Use file robot.ts in tests to automate the browser to wanted state. robot.ts
should be a module that exports an async function `runUntil` that accepts name
of the wanted state as parameter.

## Development command

You can open browser to some test scenario by passing path to folder containing
payload.config.ts to `yarn dev` command.

```shell
$ yarn dev tests/1-setup
```

You can also automate the browser to specific state of the robot by passing the
wanted state as the second argument.

```shell
$ yarn dev tests/1-setup dashboardLoaded
```
