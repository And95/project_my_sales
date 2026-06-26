import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

const port = process.env.PORT ? Number(process.env.PORT) : 5432;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const baseDataSourceOptions = {
  type: "postgres" as const,
  host: requireEnv("DB_HOST"),
  port: port,
  username: requireEnv("DB_USER"),
  password: requireEnv("DB_PASS"),
  database: requireEnv("DB_NAME"),
  entities: [`./src/modules/**/infra/database/entities/*.{ts,js}`],
  migrations: [`./src/shared/infra/typeorm/migrations/*.{ts,js}`],
};

const appTestDataSourceOptions = {
  ...baseDataSourceOptions,
  database:
    process.env.NODE_ENV === "test"
      ? requireEnv("DB_NAME_TEST")
      : requireEnv("DB_NAME"),
};

export const AppDataSource = new DataSource(
  process.env.NODE_ENV === "test"
    ? appTestDataSourceOptions
    : baseDataSourceOptions,
);
