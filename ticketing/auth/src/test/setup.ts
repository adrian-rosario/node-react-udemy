import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

// did not seem to work
// declare global {
//   var signin: () => Promise<string[]>;
// }
declare global {
  namespace NodeJS {
    export interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongoMemoryServer: any;

beforeAll(async () => {
  process.env.JWT_KEY =
    "3aa146e46a63197dde4f00bff8b9608aa067db5c8ca924dce4d7380d34eb3fa6";

  mongoMemoryServer = await MongoMemoryServer.create();
  const mongoMemoryServerUri = mongoMemoryServer.getUri();

  await mongoose.connect(mongoMemoryServerUri, {});
});

beforeEach(async () => {
  // delete/reset any existing data, start off clean
  const collections = await mongoose.connection.db.collections();

  for (let collectionItem of collections) {
    await collectionItem.deleteMany({});
  }
});

// stop the in-memory server
// disconnect from it as well
afterAll(async () => {
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "me@me.com";
  const password = "pwd4";

  const theResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = theResponse.get("Set-Cookie");

  return cookie;
};
