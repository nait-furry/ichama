const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function enqueueJob(name, payload) {
  console.log(`Queueing job: ${name}`, payload);
  // placeholder: use Redis/BullMQ in production
  return { name, payload, status: 'queued' };
}

async function processPendingJobs() {
  console.log('Processing pending background jobs (placeholder)');
  // stubbed background worker logic
}

module.exports = { enqueueJob, processPendingJobs };
