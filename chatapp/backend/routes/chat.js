const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");
const {
  chatValidation,
  chatVerification,
} = require("../middlewares/validation/chat");

router.post(
  "/create",
  chatVerification.createChat,
  chatValidation,
  chatController.createChat
);

router.get(
  "/user/:userId",
  chatVerification.getAllChats,
  chatValidation,
  chatController.getAllChats
);

router.post(
  "/message",
  chatVerification.saveMessage,
  chatValidation,
  chatController.saveMessage
);

router.get(
  "/:chatId/messages",
  chatVerification.getChatMessages,
  chatValidation,
  chatController.getChatMessages
);

router.delete(
  "/:chatId",
  chatVerification.deleteChat,
  chatValidation,
  chatController.deleteChat
);

router.patch(
  "/:chatId/rename",
  chatVerification.renameChat,
  chatValidation,
  chatController.renameChat
);

// New route to delete all chats for a user
router.delete(
  "/deleteAll/:userId",
  chatVerification.deleteAllChats, // Add a middleware for verification
  chatValidation,
  chatController.deleteAllChats // The controller method to handle this action
);

module.exports = router;
