const express = require("express");
const signupControllers = require("../controllers/signupControllers");
const { notAuthenticated } = require("../controllers/authenticate");
const router = express.Router();

router.get("/", notAuthenticated, signupControllers.signupPage);
router.post("/", notAuthenticated, signupControllers.registerUser);

module.exports = router;
