test('GET /api/v1/status returns 200', async () => {
  const response = await fetch('/api/v1/status');
  expect(response.status).toBe(200);
});