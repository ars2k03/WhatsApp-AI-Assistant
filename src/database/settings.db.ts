import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const settingsDB = mongoose.createConnection(
  process.env.MONGO_DB as string,
  {
    dbName: "settings"
  }
);