var express = require("express");
var router = express.Router();
const { createRoom, editRoom, deleteRoom, getRoom, getAllRooms } = require('../Controllers/Room');

router.post("/", createRoom);
router.put("/:id", editRoom)
router.get("/:id", getRoom)
router.delete("/:id", deleteRoom)
router.get("/", getAllRooms)

module.exports = router;
