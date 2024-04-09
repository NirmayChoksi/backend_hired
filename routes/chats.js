const express = require("express");
const chatsController = require("../controllers/chats");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, chatsController.createChat);

router.get("/:userId", checkAuth, chatsController.isExistingChat);

router.get("", checkAuth, chatsController.getChats);

router.post("/:chatId/messages", checkAuth, chatsController.addMessage);

router.get("/:chatId/messages", checkAuth, chatsController.getMessages);

module.exports = router;
