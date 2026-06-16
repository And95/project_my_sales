import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error("Missing environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: ["./src/modules/**/infra/database/entities/*.{ts,js}"],
  migrations: ["./src/shared/infra/typeorm/migrations/*.{ts,js}"],
});
