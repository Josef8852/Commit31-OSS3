const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  deleteItem,
  getMyItems,
} = require("../controllers/itemController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", getItems);
// get items belonging to authenticated user
router.get("/me", protect, getMyItems);
router.get("/:id", getItemById);

router.post("/", protect, createItem);
router.patch("/:id/status", protect, updateItemStatus);
router.delete("/:id", protect, deleteItem);

module.exports = router;
