# iChama Backend Prototype

Prototype backend for the financial infrastructure MVP described in `phase1/SDD.md`.

## Features

- Node.js + Express API scaffold
- Prisma ORM with PostgreSQL schema
- JWT authentication
- Role-based access control for group members
- Ledger-first transaction handling with audit trails
- Core REST endpoints for groups, contributions, invoices, loans, and dashboards
- Stubs for integrations and background jobs

## Setup

1. Request, and copy `.env.example` to `.env` and customize `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Apply migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /groups`
- `GET /groups/:id`
- `POST /groups/:id/contributions`
- `GET /groups/:id/contributions`
- `POST /groups/:id/invoices`
- `GET /groups/:id/invoices`
- `POST /groups/:id/loans`
- `POST /loans/:id/repay`
- `GET /groups/:id/dashboard`
- `POST /payments/webhook/mpesa`
- `POST /invoices/:id/finance`

## Testing

Run:

```bash
npm test
```

## Notes

This backend implementation is a prototype. The database schema includes audit logs and ledger transactions to support a ledger-first design and compute balances without storing derived totals.
