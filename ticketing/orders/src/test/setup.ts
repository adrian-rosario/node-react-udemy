import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats/nats-wrapper");

let mongoMemoryServer: any;

beforeAll(async () => {
  process.env.JWT_KEY =
    "3aa146e46a63197dde4f00bff8b9608aa067db5c8ca924dce4d7380d34eb3fa6";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongoMemoryServer = await MongoMemoryServer.create();
  const mongoMemoryServerUri = mongoMemoryServer.getUri();

  await mongoose.connect(mongoMemoryServerUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

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

global.signin = () => {
  // build jwt {id, email}
  //
  // const mongooseId = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  // create jwt
  //
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session Object {jwt: xxx}
  //
  const session = { jwt: token };

  // session into json
  //
  const sessionJson = JSON.stringify(session);
  // encode json as base64
  //
  const baseEncoded = Buffer.from(sessionJson).toString("base64");
  // return cookie string w/ encoded data
  //
  return [`session=${baseEncoded}`];
};
