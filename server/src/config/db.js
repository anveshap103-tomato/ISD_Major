import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Initialize PostgreSQL connection pool
const pool = new pg.Pool({ connectionString });

// Instantiate Prisma 7 PostgreSQL driver adapter
const adapter = new PrismaPg(pool);

// Prisma Client singleton configured with Prisma 7 driver adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
