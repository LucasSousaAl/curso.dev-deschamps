function status(req, res) {
  res.status(200).json({ status: 'ok' });
  // res.status(200).send("lau");
}

export default status;
