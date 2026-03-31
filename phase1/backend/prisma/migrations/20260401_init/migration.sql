CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'TREASURER', 'MEMBER');
CREATE TYPE "ContributionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');
CREATE TYPE "InvoiceStatus" AS ENUM ('REGISTERED', 'FINANCED', 'PAID', 'CANCELLED');
CREATE TYPE "LoanStatus" AS ENUM ('DRAFT', 'DISBURSED', 'REPAID', 'DEFAULTED');
CREATE TYPE "TransactionType" AS ENUM ('CONTRIBUTION', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT');

CREATE TABLE "User" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "phone" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "passwordHash" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Group" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text,
  "legalStatus" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Transaction" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" "TransactionType" NOT NULL,
  "amount" numeric NOT NULL,
  "userId" text,
  "groupId" text NOT NULL,
  "referenceId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL,
  CONSTRAINT "Transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE
);

CREATE TABLE "GroupMembership" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "groupId" text NOT NULL,
  "userId" text NOT NULL,
  "role" "Role" NOT NULL,
  "joinedAt" timestamptz NOT NULL DEFAULT now(),
  "active" boolean NOT NULL DEFAULT true,
  CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE,
  CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Contribution" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "groupId" text NOT NULL,
  "userId" text,
  "amount" numeric NOT NULL,
  "channel" text NOT NULL,
  "externalReference" text,
  "status" "ContributionStatus" NOT NULL DEFAULT 'PENDING',
  "recordedAt" timestamptz NOT NULL DEFAULT now(),
  "transactionId" text,
  CONSTRAINT "Contribution_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE,
  CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL,
  CONSTRAINT "Contribution_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id")
);

CREATE TABLE "Invoice" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "groupId" text NOT NULL,
  "supplier" text NOT NULL,
  "customer" text NOT NULL,
  "amount" numeric NOT NULL,
  "dueDate" date NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'REGISTERED',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "Invoice_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE
);

CREATE TABLE "Loan" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "groupId" text NOT NULL,
  "amount" numeric NOT NULL,
  "collateral" jsonb,
  "status" "LoanStatus" NOT NULL DEFAULT 'DRAFT',
  "disbursedAt" timestamptz,
  "dueDate" date,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "transactionId" text,
  CONSTRAINT "Loan_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE,
  CONSTRAINT "Loan_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id")
);

CREATE TABLE "LoanRepayment" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "loanId" text NOT NULL,
  "userId" text,
  "amount" numeric NOT NULL,
  "paidAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "LoanRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE,
  CONSTRAINT "LoanRepayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "AuditLog" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity" text NOT NULL,
  "entityId" text,
  "action" text NOT NULL,
  "payload" jsonb NOT NULL,
  "userId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);
