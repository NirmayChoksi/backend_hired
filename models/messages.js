const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sentDate: { type: Date, required: true },
  text: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
