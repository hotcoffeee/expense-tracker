const { compare } = require("bcrypt");
const root = require("../utils/root");
const path = require("path");
const User = require("../models/user");

exports.loginPage = async (req, res, next) => {
  if (req.session && req.session.user) res.redirect("/expense");
  else {
    res.sendFile(path.join(root, "views", "login.html"));
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) res.status(404).json({ message: "Invalid email or password!" });
    else {
      const status = await compare(password + "", user.password + "");
      if (status) {
        req.session.userId = user._id;
        req.session.user = user;
        req.session.validated = true;
        res
          .status(201)
          .json({ message: "Logged in successfully!", redirect: "/expense" });
      } else res.status(500).json({ message: "Invalid email or password!" });
    }
  } catch (err) {
    console.log("\n\nError logging in: ", err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
