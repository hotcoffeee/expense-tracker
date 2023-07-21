const expenseController = require("../controllers/expenseControls");
const express = require("express");
const { authenticate } = require("../controllers/authenticate");

const router = express.Router();

router.get("/", authenticate, expenseController.getExpensesPage);
router.get("/all/:pageNo", authenticate, expenseController.getExpenses);
router.post("/", authenticate, expenseController.postExpense);
router.delete("/:id", authenticate, expenseController.removeExpense);
// router.put("/", authenticate, expenseController.updateExpenses);
router.get("/download", authenticate, expenseController.download);

module.exports = router;
