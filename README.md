<div align="center">

# crud-app

**A secure, multi-tenant Products REST API built with Express, TypeScript & MongoDB.**

JWT authentication · Per-user data isolation · Centralized error handling

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## Overview

`crud-app` is a production-style REST API that manages a product catalog on a per-user basis. Every request is authenticated with a JSON Web Token, and every product is scoped to its owner — no user can read or mutate another user's data. The codebase follows a conventional layered architecture (routes → controllers → models) with dedicated middleware for authentication and error handling.

## Highlights

- **🔐 Token-based auth** — Stateless access tokens (5 min TTL) paired with refresh tokens for seamless session renewal.
- **🧑‍🤝‍🧑 Multi-tenant by design** — Products are partitioned by `username`; ownership is enforced at the query layer on every read and write.
- **🔒 Secure credentials** — Passwords are salted and hashed with bcrypt; secrets are injected via environment variables.
- **🧯 Centralized error handling** — A single error middleware normalizes validation, duplicate-key, and unhandled async failures into consistent JSON responses.
- **🧱 Typed end to end** — Full TypeScript coverage with typed Mongoose schemas and interfaces.

## Architecture

```
Client ──▶ Express Router ──▶ Auth Middleware ──▶ Controller ──▶ Mongoose Model ──▶ MongoDB
                                    │                  │
                              verify JWT         error middleware
```

```
.
├── app.ts                     # Composition root: middleware, routing, DB connection
├── routes/                    # HTTP route definitions
│   ├── auth.route.ts
│   └── product.route.ts
├── controllers/               # Request handlers / business logic
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── product.controller.ts
├── models/                    # Mongoose schemas & TypeScript interfaces
│   ├── user.model.ts
│   └── product.model.ts
└── middleware/                # Cross-cutting concerns
    ├── auth.middleware.ts     # JWT verification
    └── error.middleware.ts    # asyncHandler + global error handler
```

## Tech Stack

| Layer     | Technology                                            |
| --------- | ----------------------------------------------------- |
| Language  | TypeScript                                            |
| Runtime   | Node.js ([tsx](https://github.com/privatenumber/tsx)) |
| Framework | Express 5                                             |
| Database  | MongoDB + Mongoose                                    |
| Auth      | jsonwebtoken, bcrypt                                  |
| Tooling   | Prettier, Zod                                         |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone https://github.com/alinanmv/crud.git
cd crud
npm install
```

### Configuration

Environment variables are loaded from `atlas-credentials.env` and `.env` (both gitignored). Copy the provided example files and fill in your own values:

```bash
cp .env.example .env
cp atlas-credentials.env.example atlas-credentials.env
```

| File                    | Variable             | Description                       |
| ----------------------- | -------------------- | --------------------------------- |
| `atlas-credentials.env` | `MONGODB_URI`        | MongoDB connection string         |
| `.env`                  | `JWT_SECRET`         | Secret for signing access tokens  |
| `.env`                  | `REFRESH_JWT_SECRET` | Secret for signing refresh tokens |

### Run

```bash
npm run serve   # start the server
npm run dev     # start with hot reload
```

The API is served at **http://localhost:3000**.

## API Reference

### Authentication — `/api`

| Method   | Endpoint        | Description                                     | Auth |
| -------- | --------------- | ----------------------------------------------- | :--: |
| `POST`   | `/api/register` | Register a new user                             |  —   |
| `POST`   | `/api/login`    | Authenticate, returns access + refresh JWTs     |  —   |
| `POST`   | `/api/token`    | Exchange a refresh token for a new access token |  —   |
| `DELETE` | `/api/logout`   | Invalidate a refresh token                      |  —   |

<details>
<summary><strong>Example — Register & Login</strong></summary>

```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "secret"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "secret"}'
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

</details>

### Products — `/api/products`

> All product endpoints require an `Authorization: Bearer <accessToken>` header and operate only on the authenticated user's products.

| Method   | Endpoint            | Description        |
| -------- | ------------------- | ------------------ |
| `GET`    | `/api/products`     | List your products |
| `GET`    | `/api/products/:id` | Fetch a product    |
| `POST`   | `/api/products`     | Create a product   |
| `PUT`    | `/api/products/:id` | Update a product   |
| `DELETE` | `/api/products/:id` | Delete a product   |

<details>
<summary><strong>Example — Create a product</strong></summary>

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"name": "Widget", "quantity": 10, "price": 9.99}'
```

| Field      | Type   | Required | Notes                         |
| ---------- | ------ | :------: | ----------------------------- |
| `name`     | string |    ✅    |                               |
| `quantity` | number |    ✅    | defaults to `0`               |
| `price`    | number |    ✅    | defaults to `0`               |
| `image`    | string |    —     | optional                      |
| `username` | string |   auto   | derived from the access token |

</details>

## Error Handling

Errors are returned as JSON with an appropriate HTTP status code:

| Status | Condition                      |
| ------ | ------------------------------ |
| `400`  | Mongoose validation error      |
| `401`  | Missing token / wrong password |
| `403`  | Invalid or expired token       |
| `404`  | Resource not found             |
| `409`  | Duplicate key (e.g. username)  |
| `500`  | Unhandled server error         |

## Roadmap

- [ ] Request validation with Zod at the route boundary
- [ ] Persist refresh tokens in a store (currently in-memory)
- [ ] Automated test suite
- [ ] Dockerfile & CI pipeline
