const { body } = require("express-validator");

const sendMessageValidator = [
  body("receiver")
    .notEmpty()
    .withMessage("Receiver is required")
    .isMongoId()
    .withMessage("Invalid receiver id"),
  body("item")
    .notEmpty()
    .withMessage("Item is required")
    .isMongoId()
    .withMessage("Invalid item id"),
  body("content")
    .notEmpty()
    .withMessage("Message content cannot be empty")
    .isString()
    .withMessage("Content must be a string"),
];

module.exports = { sendMessageValidator };
