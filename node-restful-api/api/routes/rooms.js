const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const RoomsController = require('../controllers/rooms');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", RoomsController.get_available_rooms);

router.post("/", checkAuth, upload.single('productImage'), RoomsController.add_room);

// router.get("/:roomId", RoomsController.get_room);

router.patch("/:roomId", checkAuth, RoomsController.update_room);

router.delete("/:roomId", checkAuth, RoomsController.delete_room);

module.exports = router;
