# AI Coding Agent Instructions for Ecommerce Backend

## Project Overview
Express.js + TypeScript backend for an e-commerce platform using **Clean Architecture** with clear separation between domain, application, and infrastructure layers. Prisma ORM handles PostgreSQL. Supports REST API with OpenAPI/Swagger documentation.

## Architecture & Code Patterns

### Module Structure (Critical Pattern)
Each feature lives in `src/modules/<feature-name>/`:
- **`domain/`** - Business logic interfaces & entities (immutable, no Prisma imports)
  - Example: [User.ts](User.ts) - Domain entity with validation via `create()` static factory
  - Example: [UserRepository.ts](UserRepository.ts) - Interface defining data contract
- **`application/`** - Use cases orchestrating domain + repositories
  - Example: [login.ts](login.ts) - Takes repositories + ports as function params (dependency injection)
- **`infrastructure/`** - Concrete implementations (Prisma repos, bcrypt, JWT)
  - Example: [AuthRepositoryPrisma.ts](AuthRepositoryPrisma.ts) - Prisma adapter implementing domain interface
  - Example: [PasswordHasherBcrypt.ts](PasswordHasherBcrypt.ts) - Port implementation

### Key Files & Patterns
- [src/app.ts](src/app.ts) - Express setup with CORS, body parsing (100kb limit)
- [src/routers/v1.ts](src/routers/v1.ts) - Routes mounted at `/api/v1`
- [src/lib/prisma.ts](src/lib/prisma.ts) - Singleton Prisma client with PostgreSQL Adapter
- [prisma/schema.prisma](prisma/schema.prisma) - DB schema; generates client at `src/generated/prisma/`

### Dependency Injection Pattern
Controllers pass implementation instances to use cases (see [auth.controller.ts](src/modules/auth/auth.controller.ts#L17)):
```typescript
await login(email, password, UserRepositoryPrisma, AuthRepositoryPrisma, PasswordHasherBcrypt, TokenServiceJWT)
```
This enables testing & swapping implementations without changes to business logic.

## Development Workflow

### Essential Commands
- **`pnpm dev`** - Concurrent watch: OpenAPI generation + Express server (primary dev command)
- **`pnpm dev:docker`** - Run full stack: Express + PostgreSQL + pgAdmin via Docker Compose
  - Swagger at `http://localhost:8080/`
  - API at `http://localhost:5000/api/v1`
  - pgAdmin at `http://localhost:8000/`
- **`pnpm dev:docker:debug`** - Debug mode with Node inspector (set breakpoints in VS Code)
- **`pnpm openapi`** - Generate OpenAPI spec from JSDoc comments (watch with `pnpm watch-openapi`)
- **`pnpm reset:db`** - Wipe DB, run migrations, execute seed script

### Database Workflow
1. Modify [prisma/schema.prisma](prisma/schema.prisma)
2. Run `prisma migrate dev --name descriptive_name` to create & apply migration
3. Seed data via [scripts/db/seed.ts](scripts/db/seed.ts)
4. Access data visually: `prisma studio`

## Project Conventions

### Environment Variables (Required)
[src/shared/config/env.ts](src/shared/config/env.ts) enforces these via `required()`:
- `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`
- `DATABASE_URL` (e.g., `postgresql://user:pass@localhost:5432/db`)
- Optional: `AUTH_ACCESS_TOKEN_TTL` (900s), `AUTH_REFRESH_TOKEN_TTL` (604800s)

### Validation & Constants
- Email validation: [src/shared/config/constants.ts](src/shared/config/constants.ts) - `REGEX.EMAIL`
- Error messages: `ERROR_MESSAGES.*` (use consistently)
- Domain entities validate in `create()` static methods; throw on invalid state

### TypeScript & Build
- Target ES modules (`"type": "module"` in package.json) - use `import/export`, not `require()`
- Use `.js` extensions in imports: `import x from './file.js'`
- `tsconfig.base.json` shared across workspace; compile to `dist/` with `pnpm build`

## Integration Points

### Prisma Client Generation
Prisma generates TypeScript client at [src/generated/prisma/](src/generated/prisma/) from schema. Regenerates automatically after migrations.

### Authentication Flow
1. User POST `/api/v1/auth/login` → `loginController` 
2. Controller injects repos + services into `login()` use case
3. Use case validates credentials, generates JWT tokens
4. Response: `{ id, username, accessToken, refreshToken }`

### CORS Configuration
[src/app.ts](src/app.ts) - Only `http://localhost:5000` allowed by default. Update `origin` array when adding frontend URLs.

### Swagger/OpenAPI
Generate from JSDoc comments via [scripts/swagger/generate-openapi.ts](scripts/swagger/generate-openapi.ts). Output: `openapi.yaml` (validated with `pnpm validate-openapi`).

## Adding New Features

1. **Create module**: `src/modules/feature-name/{domain,application,infrastructure}/`
2. **Define domain** (no DB imports): Interface & entity classes
3. **Implement repositories**: Extend domain interface in infrastructure layer
4. **Write use case**: Inject dependencies as params, return plain objects
5. **Add controller**: Parse request, call use case, return response via route
6. **Mount route**: Add to [src/routers/v1.ts](src/routers/v1.ts)
7. **Document API**: JSDoc comments on controller for Swagger generation

## Common Gotchas
- Domain entities must NOT import Prisma types (keep pure)
- Use `await` on all Prisma calls
- Environment variables validated on app startup; missing vars crash the app (intentional)
- Docker Compose generates `.env` from `.nvmrc` for Node version consistency
