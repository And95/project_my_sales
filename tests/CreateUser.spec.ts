import { AppDataSource } from "../src/shared/infra/typeorm/data-source";
import appPromise from "../src/shared/infra/http/server";
import { App } from "supertest/types";
import request from "supertest";

describe("Create User", () => {
  let app: App;

  beforeEach(async () => {
    await AppDataSource.initialize();
    app = (await appPromise) as App;
  });

  afterEach(async () => {
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
    await AppDataSource.destroy();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("johndoe@example.com");
  });

  it("should not be able to create a user with duplicate email", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoeduplicate@example.com",
      password: "123456",
    });

    const response = await request(app).post("/users").send({
      name: "Jane Doe",
      email: "johndoeduplicate@example.com",
      password: "654321",
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "Email address already used.",
    );
  });
});
