import { User,Category,Pet } from '../models/model';
import {app} from '../server';
const server = app;
const request = require("supertest");
const jwt = require('jsonwebtoken');

let auth = { token: null };

beforeAll(async () => {
  const response = await request(app).post("/api/signup")
    .send({ first_name: "Benny", last_name: "Daniel", password: "bookworm",
      email: 'benny.daniel@gmail.com', age: 45, country: "India", role: 2 });
});

beforeEach(async () => {
  const response = await request(app).post("/api/login")
    .send({
      email: "benny.daniel@gmail.com",
      password: "bookworm"
    });
  auth.token = response.text;
  expect(response.statusCode).toBe(200);
});

afterAll(async () => {
  const deleted_user = await User.deleteOne({ email: 'benny.daniel@gmail.com' });
  const deleted_category = await Category.deleteOne({ name: 'Squirrel' });
  const deleted_pet = await Pet.deleteOne( { name: 'Gillu' });
});

describe("checking SuperAdmin", () => {
    test("checking role of user", async() => {
        const result = await User.findOne({ role: 1 });
        await expect(result).not.toEqual(null);
    });
});

describe("POST Methods", () => {
    test("POST Category", async() => {
      const response = await request(app).post('/api/category')
        .send({ name: "Squirrel", status: 1 }).set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
    });
    test("POST Pet", async() => {
      const response = await request(app).post('/api//category/62c2771cfa16980d377eb89b/pet')
      .send({ name: "Gillu", status: 1, breed:"Eastern Gray", age: 0.5 }).set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
    });
});

describe("GET Methods", () => {
    test("GET All Categories", async() => {
      const response = await request(app).get("/api/category").set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toBeGreaterThan(1);
    });
    test("GET Category By ID", async() => {
      const response = await request(app).get("/api/category/62c6a78fc30ab9d930e29706").set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toBe('Birds');
    });
    test("GET Pet By ID", async() => {
      const response = await request(app).get("/api/pet/62c6a7a4c30ab9d930e2970b").set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toBe('Charlie');
      expect(response.body.breed).toBe('Labrador');
    });
    test("GET Pet by Category ID", async() => {
      const response = await request(app).get("/api/category/62c6a78fc30ab9d930e29708/pet")
        .set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toBeGreaterThan(1);
      expect(response.body[0]).toHaveProperty("breed");
    });
});

describe("PUT Category & Pet", () => {
    test("PUT Category", async() => {
      const response = await request(app).put('/api/category/62cbdea1463cc7e3f1943ab3')
        .send({ status: 0 }).set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toBe('Horses');
    });
    test("PUT Pet", async() => {
      const response = await request(app).put('/api/pet/62c6baaab5310d4d4e880918')
        .send({ age: 0.3 }).set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.body.breed).toBe('sparrow');
    });
});

describe("Delete Category & Pet", () => {
    test("Delete Category", async() => {
      const response = await request(app).delete('/api/category/62d7e503e07d7c41a6df91b4')
        .set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe('"Deleted category and Pets of Category id 62d7e503e07d7c41a6df91b4"');
    });
    test("Delete Pet", async() => {
      const response = await request(app).delete('/api/pet/62c6a7a4c30ab9d930e29711')
        .set("authorization", auth.token);
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe('"Deleted Pet of id 62c6a7a4c30ab9d930e29711"');
    });
});
  
jest.clearAllTimers();

