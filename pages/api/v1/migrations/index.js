import pgMigrations from 'node-pg-migrate';
import { join } from 'node:path';
import database from 'infra/database';

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
  try {
    const migrationConfig = {
      dbClient,
      dryRun: req.method === 'GET', 
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    };

    if(req.method === 'GET') {
      const migrationPending = await pgMigrations(migrationConfig);
      return res.status(200).json({ message: 'Has migrations pending', responseBody: migrationPending });
    }


    if(req.method === 'POST') {
      const migrationExecuted = await pgMigrations(migrationConfig);

      if(migrationExecuted.length >= 1) {  
        return res.status(201).json({ message: 'Migrations ran successfully', responseBody: migrationExecuted });
      }
      
      return res.status(200).json({ message: 'Migrations ran successfully', responseBody: migrationExecuted });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }finally{
    dbClient.end();
  }
}

