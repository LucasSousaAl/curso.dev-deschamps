import pgMigrations from 'node-pg-migrate';
import { join } from 'node:path';

export default async function migrations(req, res) {
  try {
    const migrationResults = await pgMigrations({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: req.method === 'GET', 
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    });
    res.status(200).json({ message: 'Migrations ran successfully', responseBody: migrationResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

