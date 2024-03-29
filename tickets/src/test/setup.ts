import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongo: any;

jest.mock('../nats-wrapper.ts');

beforeAll(async () => {
  process.env.JWT_KEY = 'aserdgerger';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

const signin = () => {
  // Build JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

export { signin };
