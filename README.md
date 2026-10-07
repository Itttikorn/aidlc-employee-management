# Employee Management System

Greenfield Employee Management web application built with AI-DLC, TypeScript, Express, PostgreSQL, and Tailwind CSS.

## Architecture & Features

- **Unit 05 (Core Foundation)**: PostgreSQL connection pooling, migration runner, transaction manager (`withTransaction`), central error handling (`AppError`), structured logging, and solid high-contrast theme styling.
- **Strict UI Constraint**: Solid opaque cards with crisp high-contrast borders (**strictly zero glassmorphism or background blur filters**).
- **PDPA Compliant**: Data masking and sanitized error responses in production environments.

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.4+
- Docker & Docker Compose (for local PostgreSQL 16)

### Installation

```bash
bun install
# or npm install
```

### Database Setup

Start local PostgreSQL container:

```bash
docker compose up -d
```

Run database migrations:

```bash
bun run migrate
# or npm run migrate
```

### Running Tests

```bash
bun x vitest run
# or npm test
```

### Development Server

```bash
npm run dev
```
