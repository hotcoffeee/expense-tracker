const express = require("express");
const leaderboardControls = require("../controllers/leaderboardControllers");
const { authenticate } = require("../controllers/authenticate");
const router = express.Router();

router.get("/", authenticate, leaderboardControls.getLeaderboards);

module.exports = router;
