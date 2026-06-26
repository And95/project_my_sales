import FakeUserRepository from "../domain/repositories/fakes/FakeUserRepositories";
import { userMock } from "../domain/factories/UserFactory";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/errors/AppError";
import * as bcrypt from "bcrypt";
import { hash } from "bcrypt";
import "reflect-metadata";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;

describe("CreateUserService", () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createUserService = new CreateUserService(fakeUserRepository);
  });
  it("should be able to create a new user", async () => {
    (hash as jest.Mock).mockReturnValue("hashed-password");

    const user = await createUserService.execute(userMock);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("johndoe@example.com");
  });

  it("should not be able to create a user with an existing email", async () => {
    await createUserService.execute(userMock);
    await expect(createUserService.execute(userMock)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("should hash the password before saving the user", async () => {
    const hashSpy = jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValue("hashed-password" as never);

    await createUserService.execute(userMock);
    expect(hashSpy).toHaveBeenCalledWith("123456", 10);
  });
});
