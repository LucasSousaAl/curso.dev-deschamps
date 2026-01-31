const calculadora = require("../models/calculadora");

test("2+2=4", () => {
  const result = calculadora.sum(2, 2);
  expect(result).toBe(4);
});

test("'string'+2=Erro", () => {
  const result = calculadora.sum("string", 2);
  expect(result).toBe("Erro");
});
