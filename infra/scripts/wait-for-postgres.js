const { exec } = require("node:child_process");


const waitForPostgres = () => {
  
  exec("docker exec postgres-dev pg_isready --host localhost", (error, stdout) => {
    if(!stdout.includes("accepting connections")) {
      process.stdout.write(".");
      waitForPostgres();
      return;
    }
    process.stdout.write("\nPostgreSQL is ready!\n");
    
  });
};

process.stdout.write("\nConnecting to PostgreSQL");
waitForPostgres();

