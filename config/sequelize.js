<<<<<<< HEAD
// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// export const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//   }
// );

// export default sequelize;
=======
>>>>>>> target/main
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

<<<<<<< HEAD
const useSSL = String(process.env.DB_SSL || "").toLowerCase() === "true";
const rejectUnauthorized = String(process.env.DB_SSL_REJECT_UNAUTHORIZED || "false").toLowerCase() === "true";

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized } }
    : { ssl: false },
});

export default sequelize;
=======
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;

>>>>>>> target/main
