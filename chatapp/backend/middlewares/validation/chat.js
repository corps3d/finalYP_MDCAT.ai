const { body, param, validationResult } = require("express-validator");

const chatVerification = {
  createChat: [
    body("userId").isMongoId().withMessage("Invalid user ID"),
    body("chatName")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Chat name cannot be empty"),
  ],

  saveMessage: [
    body("chatId").isMongoId().withMessage("Invalid chat ID"),
    body("sender")
      .isIn(["user", "bot"])
      .withMessage("Sender must be either user or bot"),
    body("content").notEmpty().withMessage("Message content cannot be empty"),
  ],

  getChatMessages: [param("chatId").isMongoId().withMessage("Invalid chat ID")],

  getAllChats: [param("userId").isMongoId().withMessage("Invalid user ID")],

  deleteChat: [param("chatId").isMongoId().withMessage("Invalid chat ID")],
  deleteAllChats(req, res, next) {
    // You can perform any verification or authorization logic here, if necessary
    next();
  },

  renameChat: [
    param("chatId").isMongoId().withMessage("Invalid chat ID"),
    body("chatName")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Chat name cannot be empty"),
  ],
};

const chatValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  return res.json({ success: "Failure", message: error });
};

module.exports = { chatValidation, chatVerification };
