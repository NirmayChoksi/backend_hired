const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { type } = require("os");

const chatSchema = new mongoose.Schema({
  userIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  lastMessage: { type: String },
  lastMessageDate: { type: Date, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

chatSchema.plugin(uniqueValidator);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
