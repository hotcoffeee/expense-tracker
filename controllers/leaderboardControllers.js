const User = require("../models/user");

exports.getLeaderboards = async (req, res) => {
  try {
    const result = await User.find({}, ["name", "totalExpense"], {
      sort: {
        totalExpense: -1,
      },
    });

    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};
