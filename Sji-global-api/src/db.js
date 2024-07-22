import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv';

dotenv.config();

const {
  PASSWORD_DATABASE,
  USER_DATABASE,
  HOST_DATABASE,
  DATABASE,
  DATABASE_TEST,
  NODE_ENV,
  DB_PORT,
} = process.env;




const databaseString = NODE_ENV === 'test' ? DATABASE_TEST : DATABASE;

let pool;

try {
  pool = createPool({
    port: DB_PORT,
    host: HOST_DATABASE,
    user: USER_DATABASE,
    password: PASSWORD_DATABASE,
    database: databaseString,
  });
} catch (error) {
  console.error("Failed to create a database connection pool:", error);
  process.exit(1); 
}

export { pool };
