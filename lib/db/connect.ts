/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import mongoose from "mongoose";

// Check first, then assert type
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI =
  process.env.MONGODB_URI ;


// Type for our global cache
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Use a module-scoped cache instead of global
let mongooseCache: MongooseCache = (global as any).mongoose || {
  conn: null,
  promise: null,
};

if (!(global as any).mongoose) {
  (global as any).mongoose = mongooseCache;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    mongooseCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

export default dbConnect;