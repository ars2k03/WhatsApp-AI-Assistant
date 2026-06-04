import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        images: [String],
    },

    { 
        _id: false
    }

);

const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },

    history: {
      type: [MessageSchema],
      default: [],
    },
  },
  
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model('Chat', ChatSchema);