import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "only_he_db",
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
