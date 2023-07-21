const express = require("express");
const passwordControllers = require("../controllers/passwordController");

const router = express.Router();

router.get("/forgotpassword", passwordControllers.forgotPasswordPage);
router.post("/reset", passwordControllers.sendResetLink);
router.get("/resetpassword/:id", passwordControllers.resetPassword);
router.post("/resetpassword/:id", passwordControllers.updatePassword);

module.exports = router;
