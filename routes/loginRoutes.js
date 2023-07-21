const express = require("express");
const loginControllers = require("../controllers/loginControllers");
const { notAuthenticated } = require("../controllers/authenticate");
const router = express.Router();

router.get("/", notAuthenticated, loginControllers.loginPage);
router.post("/", notAuthenticated, loginControllers.authorize);
router.get("/logout", loginControllers.logout);

module.exports = router;
