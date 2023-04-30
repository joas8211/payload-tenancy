# Testing

Tests are ran using Jest and Puppeteer. Run all tests by issuing command
`yarn test`.

## Types of tests

There are three types of tests. Different types of tests have different file
extensions.

- unit.test.ts - Tests code directly by importing it.
- admin.test.ts - Tests functionality as admin panel user through browser using
  Puppeteer.
- local.test.ts - Tests functionality using Local API.
- graphql.test.ts - Tests functionality as GraphQL API client.
- rest.test.ts - Tests functionality as Rest API client.

## Folder structure

- Test scenarios can be found from "scenarios" directory where each folder
  represents one scenario or feature to test.

## Server

Admin and API tests require payload.config.ts to exist in the same directory or
upper directory. It's used to initialize Payload application. Those tests get
global variables that can be used to interact with the server.

- `payloadUrl` - URL to the running HTTP server, eg. "http://127.0.0.1:1234"
  (note that port is not static).
- `payloadReset` - Reset Payload by removing all existing documents.

## Robot

Use file robot.ts in tests to automate the test scenario to wanted state.

## Development command

You can open browser to some test scenario by passing path to folder containing
payload.config.ts to `yarn dev` command.

```shell
$ yarn dev tests/scenarios/initial-setup
```

You can also automate the browser to specific state of the robot by passing the
wanted state as the second argument.

```shell
$ yarn dev tests/scenarios/initial-setup createRootTenant
```
