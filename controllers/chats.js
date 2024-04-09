const Chat = require("../models/chats");
const Message = require("../models/messages");

exports.createChat = async (req, res) => {
  try {
    const { user, otherUser } = req.body;
    const existingChat = await Chat.findOne({
      userIds: { $all: [user.userId, otherUser.userId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat._id);
    }

    const chat = new Chat({
      userIds: [user.userId, otherUser.userId],
      users: [
        { displayName: user.displayName },
        { displayName: otherUser.displayName },
      ],
      lastMessage: "",
      lastMessageDate: new Date(),
    });

    const result = await chat.save();

    if (!result) {
      res.status(500).json({ message: "Error creating chat" });
    }

    res.status(201).json(result._id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating chat" });
  }
};

exports.isExistingChat = async (req, res) => {
  try {
    const userId = req.params.userId;
    const existingChat = await Chat.findOne({
      userIds: { $all: [req.userData.userId, userId] },
    });

    res.status(200).json(existingChat ? existingChat._id : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error finding chat" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      userIds: { $in: [req.userData.userId] },
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting chats" });
  }
};

// exports.addMessage = async (req, res) => {
//   const chatId = req.params.chatId;
//   const message = req.body.message;

//   try {
//     const chat = await Chat.findById(chatId);

//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     const newMessage = new Message({
//       senderId: req.userData.userId,
//       sentDate: new Date(),
//       text: message,
//     });

//     await chat.messages.push(newMessage);
//     await chat.save();

//     await Message.create(newMessage);

//     res.status(201).json({ message: "Message sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error adding message" });
//   }
// };

exports.addMessage = async (req, res) => {
  const chatId = req.params.chatId;
  const message = req.body.message;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const newMessage = new Message({
      senderId: "req.userData.userId",
      sentDate: new Date(),
      text: message,
    });

    chat.messages.push(newMessage);

    chat.lastMessage = message;
    chat.lastMessageDate = new Date();

    await chat.save();

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    console.log(`chatId --------------------------- ${chatId}`);
    const chat = await Chat.findById(chatId).populate("messages");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting messages" });
  }
};