import signupHandler from "../src/handlers/authHandlers/signup";
import loginHandler from "../src/handlers/authHandlers/login";
import { User } from "../src/models/user/userModel";
import bcrypt from "bcrypt";
import { Server } from "@hapi/hapi";
import hapiAuthJWT from "hapi-auth-jwt2";
import JWT from "jsonwebtoken";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

//////////// Signup HANDLER /////////////

describe("test signupHandler", () => {
  //I. return a new user
  it("should create a new user and return a success message", async () => {
    const payload = {
      pseudo: "testuser",
      email: "test@example.com",
      password: "password",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null);

    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

    jest.spyOn(User.prototype, "save").mockResolvedValue();

    const server = new Server();

    // Register the route with the handler function
    server.route({
      method: "POST",
      path: "/signup",
      handler: signupHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/signup",
      payload,
    });

    expect(response.statusCode).toBe(201);
    expect(response.result).toEqual({ message: "Inscription réussie." });
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(User.prototype.save).toHaveBeenCalled();
  });

  // II. User Already Exists Test
  it("should return 409 if user already exists", async () => {
    const payload = {
      pseudo: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.findOne function to return a user (user already exists)
    jest.spyOn(User, "findOne").mockResolvedValue({});

    const server = new Server();
    server.route({
      method: "POST",
      path: "/signup",
      handler: signupHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/signup",
      payload,
    });

    expect(response.statusCode).toBe(409);
    expect(response.result).toEqual({
      error: "Cet e-mail est déjà utilisé par un autre utilisateur.",
    });
  });

  // III. User Creation Error Test
  it("should return 500 on server error", async () => {
    const payload = {
      pseudo: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.findOne function to return null (user does not exist)
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    // Mock the bcrypt.hash function
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

    // Mock the User.save function to reject with an error
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Database error"));

    const server = new Server();
    server.route({
      method: "POST",
      path: "/signup",
      handler: signupHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/signup",
      payload,
    });

    expect(response.statusCode).toBe(500);
    expect(response.result).toEqual({
      error: "Une erreur est survenue lors de l'inscription.",
    });
  });

  // IV. Password Hashing Test
  it("should hash the password before saving the user", async () => {
    const payload = {
      pseudo: "testuser",
      email: "test@example.com",
      password: "password",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null);
    const hashSpy = jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValue("hashedPassword");
    jest.spyOn(User.prototype, "save").mockResolvedValue();

    const server = new Server();
    server.route({
      method: "POST",
      path: "/signup",
      handler: signupHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/signup",
      payload,
    });

    expect(hashSpy).toHaveBeenCalledWith("password", 10);
  });

  // Mocking Database Errors:

  it("should return 500 if database query throws an error", async () => {
    const payload = {
      pseudo: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.findOne function to reject with an error
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

    const server = new Server();
    server.route({
      method: "POST",
      path: "/signup",
      handler: signupHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/signup",
      payload,
    });

    expect(response.statusCode).toBe(500);
    expect(response.result).toEqual({
      error: "Une erreur est survenue lors de l'inscription.",
    });
  });
});

//////////// LOGIN HANDLER /////////////

describe("test loginHandler", () => {
  beforeAll(async () => {
    const server = new Server();
    await server.register(hapiAuthJWT);

    server.auth.strategy("jwt", "jwt", {
      key: process.env.JWT_SECRET,
      validate: () => ({ isValid: true }), // Mock validation
      verifyOptions: { algorithms: ["HS256"] },
    });

    server.auth.default("jwt");
  });

  it("should return 401 if password is incorrect", async () => {
    const payload = {
      email: "test@example.com",
      password: "password",
    };

    const hashedPassword = await bcrypt.hash("different_password", 10);
    jest.spyOn(User, "findOne").mockResolvedValue({
      email: "test@example.com",
      password: hashedPassword,
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const server = new Server();
    server.route({
      method: "POST",
      path: "/login",
      handler: loginHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload,
    });

    expect(response.statusCode).toBe(401);
    expect(response.result).toEqual({ message: "Mot de passe incorrect." });
  });

  it("should return 500 if JWT token generation fails", async () => {
    const payload = {
      email: "test@example.com",
      password: "password",
    };

    const hashedPassword = await bcrypt.hash("password", 10);
    jest.spyOn(User, "findOne").mockResolvedValue({
      email: "test@example.com",
      password: hashedPassword,
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    JWT.sign.mockImplementation(() => {
      throw new Error("JWT token generation error");
    });

    const server = new Server();
    server.route({
      method: "POST",
      path: "/login",
      handler: loginHandler,
    });

    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload,
    });

    expect(response.statusCode).toBe(500);
    expect(response.result).toEqual({ error: "JWT token generation error" });
  });
});
