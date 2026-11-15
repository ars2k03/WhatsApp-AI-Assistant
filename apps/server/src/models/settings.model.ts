import mongoose from "mongoose";
import { settingsDB } from "../database/settings.db.js";

const SettingsSchema = new mongoose.Schema({
  isEnableAi: {
    type: Boolean,
    default: true,
  },
});

export const Settings = settingsDB.model( "Settings", SettingsSchema);