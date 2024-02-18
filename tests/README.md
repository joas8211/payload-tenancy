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

To initialize Payload server, run `initPayload` from payload.ts before all
tests. Remember to run `reset` before each test and `close` after all tests.

Example:

```typescript
describe("scenario", () => {
  let url: string;
  let reset: () => Promise<void>;
  let close: () => Promise<void>;

  beforeAll(async () => {
    ({ url, close, reset } = await initPayload({ dir: __dirname }));
  });

  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await close();
  });
});
```

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

## PostgreSQL

You can run tests using real PostgreSQL database with Docker:

```shell
$ docker-compose up
```
