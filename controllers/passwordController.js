const root = require("../utils/root");
const path = require("path");
const sendMail = require("../utils/mail");
const PasswordResetRequest = require("../models/passwordrequest");
const User = require("../models/user");
const { hash } = require("bcrypt");
// const sequelize = require("../utils/database");

exports.forgotPasswordPage = async (req, res) => {
  try {
    req.session.destroy();
    res.sendFile(path.join(root, "views", "forgot.html"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    const url =
      req.protocol + "://" + req.get("host") + "/password/resetpassword";
    const { v4: uuidv4 } = require("uuid");

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email is not registered!");
    }

    const resetRequest = PasswordResetRequest.create({
      userId: user._id,
      id: uuidv4(),
    });

    console.log(resetRequest);

    await sendMail(email, url, resetRequest.id);
    res
      .status(201)
      .json({ message: "Reset link sent, please check your email." });
  } catch (err) {
    console.log(`\n\n\n\n${err}\n\n\n\n`);
    res.status(400).json(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.redirect("/404");
    const resetRequest = await PasswordResetRequest.find({ id });

    if (!resetRequest) return res.redirect("/404");

    res.sendFile(path.join(root, "views", "reset.html"));
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const id = req.params.id;
    if (!id)
      return res
        .status(201)
        .json({ message: "Invalid request!", redirect: "/login" });

    const [resetRequest] = await PasswordResetRequest.find({ id }).populate(
      "userId"
    );
    if (!resetRequest)
      res.status(201).json({ message: "Invalid request!", redirect: "/login" });

    console.log(resetRequest);
    if (resetRequest.isActive) {
      resetRequest.isActive = false;
      await resetRequest.save();
      const user = resetRequest.userId;

      const saltrounds = 10;
      const hashedPW = await hash(password + "", saltrounds);
      user.password = hashedPW;
      await user.save();
      res.status(201).json({ message: "Password updated!" });
    } else throw new Error("Request Expired!");
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: JSON.stringify(err.message) });
  }
};
