const express = require("express");
const premiumControllers = require("../controllers/premiumControllers");
const { authenticate } = require("../controllers/authenticate");
const router = express.Router();

router.get("/", authenticate, premiumControllers.isPremium);
router.post("/", authenticate, premiumControllers.buyPremium);
router.put("/", authenticate, premiumControllers.updateTransactionStatus);
module.exports = router;
