const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../authentication/auth");

router.post("/user", userController.registerUser);
router.post("/user/login", userController.userLogin);
router.get("/user", auth.authenticator, userController.getUser);

module.exports = router;
