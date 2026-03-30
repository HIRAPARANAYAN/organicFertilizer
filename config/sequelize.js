import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // postgres
  process.env.DB_USER,     // your long hex user string
  process.env.DB_PASSWORD, // your sk_... password
  {
    host: process.env.DB_HOST, // db.prisma.io
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Set to console.log if you want to see SQL queries
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for hosted databases like Prisma/Supabase/Render
      },
    },
  }
);

// Function to test the connection (Optional but recommended)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

testConnection();

export { sequelize };
export default sequelize;
