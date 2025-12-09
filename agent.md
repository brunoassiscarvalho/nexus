Use vertical slices to folder structure and system design

## Vertical Slices

Vertical Slices is a way to organize your codebase by feature or domain. It's a way to think about your codebase as a series of vertical slices, where each slice represents a single feature or domain.

## Atomic Design

Atomic Design is a methodology for creating design systems. It's a way to think about your design system as a series of atoms, molecules, organisms, templates, and pages.

## Folder Structure

```
apps/
├── api/
#Nestjs
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   ├── index.ts
│   │   │   │   └── routes.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   ├── index.ts
│   │   │   │   └── routes.ts
│   │   │   └── ...
│   │   ├── shared/
│   │   │   ├── middlewares/
│   │   │   ├── utils/
│   │
├── web/
# React App
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   ├── index.ts
│   │   │   │   └── routes.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   ├── index.ts
│   │   │   │   └── routes.ts
│   │   │   └── ...
|   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── routes.ts
e2e/
#playwright
├── api/
├── web/
packages/
├── ui/
│   ├── atoms/
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
|   |   ├── index.ts
│   │   └── ...
│   ├── molecules/
|   |   ├── card/
|   |   ├── input/
|   |   ├── index.ts
|   |   └── ...
│   ├── organisms/
|   |   ├── grid/
|   |   ├── menu/
|   |   ├── index.ts
|   |   └── ...
│   ├── templates/
|   |   ├── dashboard/
|   |   ├── auth/
|   |   ├── index.ts
│   |   └── ...
├── utils/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── storage/
│   │   │   └── ...
│   │   ├── index.ts
│   │   └── ...
├── config/
│   ├──tsconfig.json
│   ├──tailwind.config.js
│   ├──eslint.config.js
│   ├──vite.config.js
│   ├──.prettierrc
│   ├──.eslintrc.json
│   ├──.prettierignore
│   ├──.huskyrc
│   ├──.lintstagedrc
├── types/
│   ├── src/
│   │

```

## Requisites

Must be integration tests
Must be e2e tests
Must be unit tests
Must be component tests
Must be monitoring
Must be analytics
Must be CI/CD
Must be code quality
Must be observability
Must be monorepo
Must be frontend
Must be backend
Must be storage
Must be tests
Must be documentation
must be a monorepo
must be security tests

## Monorepo

Centralize config in an package
Centralize utils in an package

Centralize styles and components in an package
Centralize utils in an package
Centralize types in an package
Shared types between frontend and backend
Centralize integration tests in an app
Avoid repetition of code
Avoid repetition of logic
Avoid repetition of components
Avoid repetition of styles
Avoid repetition of tests
Avoid repetition of documentation
Avoid repetition of anything
Avoid styles and css outside of the ui package
Avoid feature logic outside of the features
Avoid components outside of the ui package
Avoid tests outside of the tests package
Avoid documentation outside of the docs package

## Monitoring

Use 4 golden signals
Crete panels with the 4 golden signals

## Analytics

Colect products metrics
Use AARRR Framework
Collect user metrics
Collect business metrics

## Monorepo

- [x] Turborepo
- [x] npm
- [x] Changesets
- [x] TypeScript

## CI/CD

- [x] GitHub Actions
- [x] Docker
- [x] Docker Compose
- [x] Nginx

## Frontend

- [x] React
- [x] Vite
- [x] TailwindCSS
- [x] Storybook

## Backend

- [x] NestJS
- [x] OpenAPI
- [x] Swagger
- [x] TypeORM

## Storage

- [x] Redis
- [x] RabbitMQ
- [x] MongoDB

## Tests

- [x] Playwright
- [x] Vitest

## Code Quality

- [x] ESLint
- [x] Prettier
- [x] Husky
- [x] Lint Staged

## Observability

- [x] Prometheus
- [x] Grafana
- [x] Loki
- [x] Tempo

## Analytics

- [x] Google Analytics

## Security

- [x] CORS
- [x] CSRF
- [x] XSS
- [x] SQL Injection
- [x] Rate Limiting

## Authentication

- [x] Auth0
- [x] Google
- [x] Facebook
- [x] Apple
- [x] JWT

## Payments

- [x] Stripe
- [x] PayPal

## Notifications

- [x] Firebase
- [x] Email
- [x] Push
- [x] SMS
