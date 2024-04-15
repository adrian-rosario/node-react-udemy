import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongoMemoryServer: any;

beforeAll(async () => {
  mongoMemoryServer = new MongoMemoryServer();
  const mongoMemoryServerUri = await mongoMemoryServer.getUri();

  await mongoose.connect(mongoMemoryServerUri, {
    // used in visual example, throws linting noise
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
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
});
