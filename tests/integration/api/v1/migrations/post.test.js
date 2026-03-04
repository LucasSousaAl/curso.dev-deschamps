import database from "infra/database";
const dotenv = require('dotenv');

dotenv.config({
    path: '.env.development',
});

test('POST /api/v1/migrations returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  });
  expect(response.status).toBe(200);
  const { responseBody } = await response.json();
  
  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);

  
});