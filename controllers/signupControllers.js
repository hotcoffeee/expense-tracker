const { hash } = require("bcrypt");
//next time use hashSync and compareSync
const root = require("../utils/root");
const path = require("path");
const User = require("../models/user");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      res
        .status(401)
        .json({ message: "A user with this email already exists!" });
    } else {
      const saltrounds = 10;
      // hash(password + "", saltrounds, async (err, hashedPW) => {
      //   if (err) {
      //     throw new Error(err);
      //   }
      // });
      const hashedPW = await hash(password + "", saltrounds);
      await User.create({
        name,
        email,
        password: hashedPW,
      });
      res
        .status(201)
        .json({ message: "User registered successfully!", redirect: "/login" });
    }
  } catch (err) {
    res.status(500).json({ message: "Couldn't register user!" });
  }
};

exports.signupPage = (req, res, next) => {
  if (req.session.validated) res.redirect("/expense");
  else res.sendFile(path.join(root, "views", "signup.html"));
};
