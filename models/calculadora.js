function sum(args1, args2) {
  if (isNaN(args1) || isNaN(args2)) return "Erro";
  return args1 + args2;
}

exports.sum = sum;
