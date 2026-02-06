import database from '../../../../infra/database';

async function status(req, res) {
  console.log(await database.query("SELECT 1 + 1 as sum;"));
  res.status(200).json({ status: 'ok' });
  // res.status(200).send("lau");
}

export default status;
