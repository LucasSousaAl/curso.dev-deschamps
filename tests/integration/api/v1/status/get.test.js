test('GET /api/v1/status returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  // console.log(response);
  expect(response.status).toBe(200);

  const responseBody = await response.json();


  expect(responseBody).toHaveProperty('updated_at');
  expect(responseBody.updated_at).toBeTruthy();
  const updatedAtDate = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(updatedAtDate);

  // database
  const databaseResponse = responseBody.dependencies?.database;
  expect(databaseResponse).toBeTruthy();
  
  // version
  expect(databaseResponse).toHaveProperty('version');
  expect(databaseResponse.version).toBeTruthy();
  expect(typeof databaseResponse.version).toBe("string");
  expect(databaseResponse.version).toBe('PostgreSQL 16.11 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit');

  // max connections
  expect(databaseResponse).toHaveProperty('max_connections');
  expect(databaseResponse.max_connections).toBeTruthy();
  expect(typeof databaseResponse.max_connections).toBe("number");
  expect(databaseResponse.max_connections).toBeGreaterThan(0);

  // connections used
  expect(databaseResponse).toHaveProperty('connections_used');
  expect(databaseResponse.connections_used).toBeTruthy();
  expect(typeof databaseResponse.connections_used).toBe("number");
  expect(databaseResponse.connections_used).toBeGreaterThanOrEqual(1);

});