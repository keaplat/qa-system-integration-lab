# QA System Integration Lab

Laboratório de automação de QA ponta a ponta, projetado para se parecer com um trabalho real de validação de sistemas: fluxo de UI, verificação de API backend, checagens de persistência em banco de dados, ambiente com Docker e integração contínua.

## O que este repositório demonstra

- Automação de UI com Playwright
- Validação de API na mesma suíte
- Verificação direta no banco de dados após fluxos transacionais
- Docker Compose para execução reproduzível localmente e em CI
- Relatórios HTML, trace e screenshots em caso de falhas
- Separação limpa entre page objects, clientes de API e helpers de banco

## Fluxo de negócio testado

O sistema de exemplo simula uma pequena storefront. A suíte valida:

- listagem de produtos
- requisição de checkout
- feedback de sucesso na UI
- dados do pedido retornados pela API
- persistência do pedido no PostgreSQL
- validação no frontend para entrada de e-mail inválida

## Arquitetura

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
