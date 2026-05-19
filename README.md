# QA System Integration Lab

End-to-end QA automation lab designed to look like real system validation work: UI flow, backend API verification, database persistence checks, Dockerized environment and CI.

## What this repository demonstrates

- UI automation with Playwright
- API validation in the same suite
- Direct database verification after transactional flows
- Docker Compose for reproducible local and CI execution
- HTML reporting, trace and screenshots on failures
- Clean separation between page objects, API clients and DB helpers

## Business flow under test

The sample system simulates a lightweight storefront. The suite validates:

- product listing
- checkout request
- success feedback in UI
- order data returned by the API
- order persistence in PostgreSQL
- frontend validation for invalid email input

## Architecture

```text
.
|-- src
|   |-- api
|   |   `-- AdminOrdersClient.ts
|   |-- app
|   |   |-- db.ts
|   |   |-- products.ts
|   |   |-- server.ts
|   |   `-- types.ts
|   |-- db
|   |   `-- DatabaseClient.ts
|   |-- frontend
|   |   |-- app.js
|   |   |-- index.html
|   |   `-- styles.css
|   `-- pages
|       `-- CatalogPage.ts
|-- tests
|   |-- api
|   |   `-- products-api.spec.ts
|   |-- e2e
|   |   `-- checkout.spec.ts
|   `-- fixtures
|       `-- test-base.ts
|-- scripts
|   |-- globalSetup.ts
|   `-- globalTeardown.ts
|-- docker-compose.yml
`-- .github
    `-- workflows
        `-- integration-tests.yml
```

## How to run

```bash
npm install
npx playwright install chromium
npm test
```

The test runner brings the environment up with Docker Compose and tears it down automatically.

## Why this is portfolio-grade

- It validates the same transaction across three layers: UI, API and database.
- It uses an actual PostgreSQL service, not a fake stub.
- It keeps QA code isolated from application code but close enough to model real workflows.
- It is reproducible in CI with containerized infrastructure.
