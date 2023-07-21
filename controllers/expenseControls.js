const Expense = require("../models/expense");
const User = require("../models/user");
const root = require("../utils/root");
const { join } = require("path");
// const upload = require("../utils/aws");

exports.postExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.session.userId;
    const reply = await Expense.create({
      amount,
      description,
      category,
      userId,
    });
    const user = await User.findById(userId);

    user.totalExpense = parseInt(user.totalExpense) + parseInt(amount);

    await user.save();

    res.status(201).json({ message: "Entry saved!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Couldn't save data!" });
  }
};

exports.getExpensesPage = async (req, res, next) => {
  if (req.session.validated) {
    res.sendFile(root + "/views/expenses.html");
  } else {
    res.redirect("/login");
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const pageNo = req.params.pageNo;

    const offset = (pageNo - 1) * 5;

    const tuples = await Expense.find({ userId }, [], {
      limit: 5,
      skip: offset,
    });
    // const tuples = await Expense.find({ userId }).limit(5).skip(offset);
    res.status(201).json({ success: true, entries: tuples });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "Error occured while fetching data!" });
  }
};

exports.removeExpense = async (req, res, next) => {
  const _id = req.params.id;
  console.log(req.params);
  const userId = req.session.userId;
  try {
    const expense = await Expense.findById(_id);

    const user = await User.findById(userId);
    user.totalExpense = user.totalExpense - expense.amount;

    await Expense.findByIdAndDelete(_id);
    await user.save();

    res.status(201).json({ success: true, message: "Entry Deleted!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Couldn't delete!" });
  }
};

// exports.updateExpenses = async (req, res, next) => {
//   try {
//     const { id, amount, description, category } = req.body;
//     await Expense.update(
//       {
//         amount,
//         description,
//         category,
//       },
//       { where: { id } }
//     );
//     res.status(201).json({ message: "Entry updated!" });
//   } catch (err) {
//     res.status(400).json({ success: false, message: "Couldn't update!" });
//   }
// };

exports.download = async (req, res) => {
  try {
    const records = await Expense.find({ userId: req.session.userId }, [
      "amount",
      "description",
      "category",
      "-_id",
    ]);
    console.log(records);
    res.status(200).json({
      records,
      filename: `${req.session.user.name} ${new Date()}.json`,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "Couldn't generate file!" });
  }
};
