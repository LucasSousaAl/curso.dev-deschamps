import database from 'infra/database';
// lembra de testar o comando compose down sem e com o -v para ver a persistencia dos dados

async function status(req, res) {
  const updatedAt = new Date().toISOString();
  const databaseHealth = await database.query("SELECT version();");
  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const databaseConnectionsUsed = await database.query({
    text:"SELECT count(*)::int AS connections FROM pg_stat_activity WHERE datname = $1 AND backend_type = 'client backend';",
    values: [process.env.POSTGRES_DB]
  });
  res.status(200).json({ 
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseHealth?.[0]?.version || null,
        max_connections: Number(databaseMaxConnections?.[0]?.max_connections) || null,
        connections_used: databaseConnectionsUsed?.[0]?.connections || null
      }
    }
   });
}


export default status;
