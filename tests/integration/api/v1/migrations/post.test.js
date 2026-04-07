import database from "infra/database";
import orchestrator from "../orchestrator.js";


beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test('POST /api/v1/migrations returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  });
  expect(response.status).toBe(201);
  const { responseBody } = await response.json();
  // console.log(responseBody);
  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);

  const responseAgain = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  });
  expect(responseAgain.status).toBe(200);
  const { responseBody: responseAgainBody } = await responseAgain.json();
  
  expect(Array.isArray(responseAgainBody)).toBe(true);
  expect(responseAgainBody.length).toBe(0);

});