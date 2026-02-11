import { Client, Pool } from "pg";


async function query(queryObject){
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false
  });
  try{
    await client.connect();
    const res = await client.query(queryObject);
    return res.rows; 
  }catch(error){
    console.error("Database query error:", error);
    throw error;
  }
  finally{
    await client.end();
  }
}



export default {
  query: query 
};