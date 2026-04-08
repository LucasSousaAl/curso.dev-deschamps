const { exec } = require("node:child_process");

const waitForPostgres = () => {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (!stdout.includes("accepting connections")) {
        process.stdout.write(".");
        waitForPostgres();
        return;
      }
      process.stdout.write("\n✅🚀 PostgreSQL is ready!\n");
    },
  );
};

process.stdout.write("\n⌛👨‍💻 Connecting to PostgreSQL");
waitForPostgres();
