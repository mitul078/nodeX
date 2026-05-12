# Nodex — Group File Sharing Backend

A production-ready microservice backend that lets users create groups, add contacts, and share documents, photos, and videos — with built-in monetization.

---

## What is Nodex

Nodex is a backend platform where users can:

- Register and login securely
- Search for people they know and add them as contacts
- Create groups and add contacts to them
- Share files (documents, images, videos) inside groups
- Upgrade their plan to unlock higher limits

Think of it as the backend for a WhatsApp-style group file sharing app.

---

## Who is this for

- Developers who want a ready-made backend for a group collaboration or file sharing app
- Startups building a document sharing or team workspace product
- Anyone learning microservice architecture with real-world patterns

---

## Architecture

Nodex is built using microservice architecture — each feature lives in its own independent service:

```
┌─────────────────────────────────────────────┐
│                  API Gateway                 │
│              http://localhost:4000           │
└──────┬──────┬──────┬──────┬──────┬──────────┘
       │      │      │      │      │
    Auth   Users  Groups  Media  Billing
    :4001  :4002  :4003   :4004   :4005
```

All client requests go through the API Gateway on port 4000. Services communicate with each other directly over an internal Docker network using RabbitMQ for async events.

---

## Services

### Auth Service (:4001)
Handles user registration, login, JWT access tokens, and refresh tokens. Publishes a `auth.user.created` event to RabbitMQ when a user registers.

### User Service (:4002)
Manages user profiles, avatar generation (SVG initials uploaded to S3), contact requests, and internal user lookup for other services.

### Group Service (:4003)
Handles group creation, member management, and role assignment. Enforces plan-based limits on groups and members per group.

### Media Service (:4004)
Handles file uploads to AWS S3, file metadata storage in MongoDB, and file retrieval. Enforces plan-based limits on file size, file type, and total storage.

### Billing Service (:4005)
Integrates with Stripe for payments. Manages subscription plans (Free, Pro, Business), processes webhooks, and runs a daily cron job to downgrade expired plans.

### Shared Package
A local npm package (`@nodex/shared`) containing shared utilities used by all services — error/success response helpers, JWT middleware, input validation, plan limits config, and the limitGuard middleware.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express (auth, users, groups) + Fastify (media, billing, gateway) |
| Database | MongoDB Atlas |
| Message Broker | RabbitMQ (CloudAMQP) |
| File Storage | AWS S3 |
| Payments | Stripe |
| Auth | JWT (access + refresh tokens) |
| Containerization | Docker + Docker Compose |
| Validation | express-validator |
| Password hashing | bcrypt |

---

## Monetization Plans

| Feature | Free | Pro | Business |
|---|---|---|---|
| Groups | 3 | 20 | Unlimited |
| Members per group | 10 | 100 | 1000 |
| Storage per group | 1 GB | 10 GB | 100 GB |
| Max file size | 25 MB | 100 MB | 500 MB |
| File types | Image, Doc | Image, Doc, Video | All types |
| Price | Free | ₹299/month | ₹999/month |

---

## Project Structure

```
nodex/
├── auth/                   # Auth service
├── users/                  # User service
├── groups/                 # Group service
├── media/                  # Media service
├── billing/                # Billing service
├── gateway/                # API Gateway
├── shared/                 # Shared package (@nodex/shared)
│   ├── src/
│   │   ├── config/
│   │   │   └── plans.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── limit.middleware.js
│   │   │   └── internal.middleware.js
│   │   └── utils/
│   │       ├── error.js
│   │       └── success.js
│   └── index.js
└── docker-compose.yml
```

Each service follows the same internal structure:
```
service/
├── src/
│   ├── config/       # db, env, rabbit
│   ├── controllers/  # request handlers
│   ├── models/       # mongoose schemas
│   ├── routes/       # express/fastify routes
│   ├── validators/   # input validation rules
│   ├── middlewares/  # auth, internal
│   └── services/     # inter-service HTTP calls
├── .env
├── Dockerfile
├── package.json
└── server.js
```

---

## How to Run

### Prerequisites

- Docker and Docker Compose installed
- MongoDB Atlas account (free tier works)
- CloudAMQP account (free tier works)
- AWS S3 bucket
- Stripe account (test mode)

### 1. Clone the repository

```bash
git clone https://github.com/yourname/nodex.git
cd nodex
```

### 2. Set up environment variables

Each service has its own `.env` file. Create them using the templates below:

**auth/.env**
```bash
PORT=4001
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nodex-auth
JWT_SECRET=your_jwt_secret_here
RABBITMQ_URL=amqps://user:pass@your-instance.cloudamqp.com/vhost
INTERNAL_SECRET=your_internal_secret_here
```

**users/.env**
```bash
PORT=4002
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nodex-users
JWT_SECRET=your_jwt_secret_here
RABBITMQ_URL=amqps://user:pass@your-instance.cloudamqp.com/vhost
INTERNAL_SECRET=your_internal_secret_here
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
```

**groups/.env**
```bash
PORT=4003
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nodex-groups
JWT_SECRET=your_jwt_secret_here
RABBITMQ_URL=amqps://user:pass@your-instance.cloudamqp.com/vhost
INTERNAL_SECRET=your_internal_secret_here
USER_SERVICE_URL=http://nodex-users:4002
```

**media/.env**
```bash
PORT=4004
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nodex-media
JWT_SECRET=your_jwt_secret_here
RABBITMQ_URL=amqps://user:pass@your-instance.cloudamqp.com/vhost
INTERNAL_SECRET=your_internal_secret_here
GROUP_SERVICE_URL=http://nodex-groups:4003
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
```

**billing/.env**
```bash
PORT=4005
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nodex-billing
JWT_SECRET=your_jwt_secret_here
RABBITMQ_URL=amqps://user:pass@your-instance.cloudamqp.com/vhost
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**gateway/.env**
```bash
PORT=4000
AUTH_SERVICE_URL=http://nodex-auth:4001
USER_SERVICE_URL=http://nodex-users:4002
GROUP_SERVICE_URL=http://nodex-groups:4003
MEDIA_SERVICE_URL=http://nodex-media:4004
BILLING_SERVICE_URL=http://nodex-billing:4005
```

### 3. Start all services

```bash
docker compose up --build
```

All 6 services start together. The API is available at `http://localhost:4000`.

### 4. Stop all services

```bash
docker compose down
```

---

## API Overview

All requests go through `http://localhost:4000`.

| Service | Base Path |
|---|---|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Groups | `/api/v1/groups` |
| Media | `/api/v1/media` |
| Billing | `/api/v1/billing` |

See `TEST.md` for full API documentation with request/response examples.

---

## Event-Driven Communication

Services communicate asynchronously via RabbitMQ:

| Publisher | Event | Subscriber | Action |
|---|---|---|---|
| auth-service | `auth.user.created` | user-service | Creates user profile + SVG avatar |
| billing-service | `plan.upgraded` | auth-service | Updates plan field in Auth model |

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Access tokens expire in 15 minutes. Use the refresh token endpoint to get a new one.

---

## Key Design Decisions

**Why microservices?** Each service can be scaled, deployed, and updated independently. If media service goes down, auth still works.

**Why RabbitMQ?** When a user registers, auth-service fires an event and moves on. User-service creates the profile in the background. Even if user-service is temporarily down, the event waits in the queue.

**Why shared package?** Error handling, success responses, JWT middleware, and plan limits are identical across services. One change in shared propagates everywhere.

**Why JWT carries plan?** Every service needs to know the user's plan to enforce limits. Putting it in the JWT means no DB call on every request — the plan is read directly from the decoded token.

**Why soft delete?** Records are never permanently deleted — `isActive: false` instead. This preserves history, enables recovery, and prevents foreign key issues.

---

## License

MIT
