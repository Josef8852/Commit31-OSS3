const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const {
  sendMessage,
  getConversations,
  getMessagesWithUser,
  markAsRead,
  getUnreadCount,
} = require("../controllers/messageController");
const { sendMessageValidator } = require("../validators/messageValidator");

// POST /api/messages
router.post("/", protect, sendMessageValidator, sendMessage);

// GET /api/messages/conversations
router.get("/conversations", protect, getConversations);

// GET /api/messages/unread/count
router.get("/unread/count", protect, getUnreadCount);

// GET /api/messages/with/:userId
router.get("/with/:userId", protect, getMessagesWithUser);

// PATCH /api/messages/:id/read
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
