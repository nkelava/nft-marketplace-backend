# NFT Marketplace (backend)

A small Express + Prisma REST API that serves as the backend for an NFT marketplace. It is a learning project focused on web3 (wallet-address based) authentication and a basic NFT CRUD API.

The project is at an early stage: today it provides a PostgreSQL-backed **user** resource with full CRUD endpoints. Authentication and NFT endpoints are not implemented yet.

## Tech stack

- **Node.js 18** with **Express 4** (CommonJS)
- **PostgreSQL** via **Prisma ORM 4**
- **Docker / Docker Compose** for running the API and database together
- ESLint (Airbnb base) and Prettier for code style

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm (or pnpm)
- A PostgreSQL database — either your own, or the one started by Docker Compose
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (optional)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/nkelava/nft-marketplace-backend.git
cd nft-marketplace-backend
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

Then edit `.env`. In particular, `DB_HOST` in the example holds two alternatives — set it to a single value (see [Configuration](#configuration)).

### 3. Set up the database

Make sure PostgreSQL is running and reachable with the credentials from `.env`. To start only the database from the Compose file:

```bash
docker compose up -d postgres
```

Apply the migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

The Prisma schema location is configured in `package.json`, so no `--schema` flag is needed.

### 4. Run the server

```bash
npm run start:dev   # development, restarts on file changes (nodemon)
npm start           # plain node
```

The API listens on `http://localhost:5001` by default.

### Running everything with Docker Compose

```bash
docker compose up --build
```

This starts a `postgres` service and an `api` service (built from the `Dockerfile`, running `start:dev`). The project directory is mounted into the container, so code changes are picked up live. Compose reads the values from your `.env` file.

> **Note:** the `Dockerfile` copies `pnpm-lock.yaml`, which is not currently committed. Generate it first with `pnpm install`, or the image build will fail.

## Configuration

All configuration is done through environment variables, loaded from `.env` (see `.env.example`).

| Variable      | Example                                                                    | Used by                      | Description |
| ------------- | -------------------------------------------------------------------------- | ---------------------------- | ----------- |
| `SERVER_PORT` | `5001`                                                                     | API, Docker Compose          | Port the Express server listens on. Defaults to `5001`. |
| `DB_HOST`     | `localhost`                                                                | `DB_URL`                     | Database host. Use `host.docker.internal` when the API runs in Docker and connects to Postgres through the host ([background](https://github.com/prisma/prisma/issues/1385#issuecomment-576695684)). |
| `DB_PORT`     | `5432`                                                                     | `DB_URL`, Docker Compose     | Database port. |
| `DB_USER`     | `root`                                                                     | `DB_URL`, Docker Compose     | Database user. |
| `DB_PASSWORD` | `root`                                                                     | `DB_URL`, Docker Compose     | Database password. |
| `DB_NAME`     | `test`                                                                     | `DB_URL`, Docker Compose     | Database name. |
| `DB_URL`      | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` | Prisma | Connection string read by `schema.prisma`. Built from the variables above. |

## API

Base path: `/api/v1`

| Method   | Endpoint         | Description |
| -------- | ---------------- | ----------- |
| `GET`    | `/user`          | List all users |
| `POST`   | `/user`          | Create a user. Body: `address` (required), `email`, `password` |
| `GET`    | `/user/:id`      | Get a user's `address`, `email` and `username` |
| `POST`   | `/user/:id`      | Update a user's `email` |
| `DELETE` | `/user/:id`      | Delete a user (responds `204 No Content`) |

Successful responses wrap the result in `{ "data": ... }`; errors return `{ "message": ... }`.

Example:

```bash
# Create a user
curl -X POST http://localhost:5001/api/v1/user \
  -H "Content-Type: application/json" \
  -d '{"address": "0x1234...abcd", "email": "alice@example.com"}'

# Fetch it
curl http://localhost:5001/api/v1/user/1
```

### Data model

The `User` model (table `users`) stores a wallet `address` plus optional profile fields: `email` and `username` (both unique), `password`, `biography`, `profile_image`, `header_image`, `refresh_tokens`, a `role` (`USER` or `ADMIN`, default `USER`) and `created_at` / `updated_at` timestamps. See `src/db/prisma/schema.prisma`.

## Project structure

```
.
├── src/
│   ├── server.js                 # App entry point: Express setup, middleware, routes
│   ├── db/
│   │   ├── client.js             # Shared PrismaClient instance
│   │   └── prisma/
│   │       ├── schema.prisma     # Database schema (User model, Role enum)
│   │       └── migrations/       # SQL migrations generated by Prisma
│   └── user/
│       ├── index.js              # Exports the user router and controller
│       ├── user.router.js        # Routes for /api/v1/user
│       └── user.controller.js    # Request handlers (CRUD via Prisma)
├── docs/
│   └── database/
│       ├── prisma.md             # Notes on setting up Prisma
│       └── improvements.md       # Ideas for database security and performance
├── Dockerfile                    # API image (Node 18 Alpine, pnpm)
├── docker-compose.yaml           # API + PostgreSQL services
├── .env.example                  # Environment variable template
├── .eslintrc.json                # ESLint config (Airbnb base + Prettier)
└── .prettierrc                   # Prettier config
```

## Scripts

| Command             | Description |
| ------------------- | ----------- |
| `npm run start:dev` | Start the server with nodemon (auto-restart) |
| `npm start`         | Start the server with node |

Useful Prisma commands:

```bash
npx prisma migrate dev --name <name>   # create and apply a new migration after editing the schema
npx prisma studio                      # browse the database in a web UI
```

## Roadmap

- Web3 (wallet signature) authentication
- NFT CRUD API

## License

ISC, as declared in `package.json`.
