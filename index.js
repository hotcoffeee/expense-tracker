const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const root = require("./utils/root");
const path = require("path");
const fs = require("fs");

// const User = require("./models/user");
// const Expense = require("./models/expense");
// const Order = require("./models/order");
// const ForgotPasswordRequest = require("./models/passwordrequest");

// User.hasMany(Expense);
// Expense.belongsTo(User);
// User.hasMany(Order);
// User.hasMany(ForgotPasswordRequest, { foreignKey: "userId" });
// ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId" });

const app = express();

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

app.use(cors());
app.use(
  session({
    secret: "someSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);
app.use(cookieParser());
app.use(bp.json());
app.use(express.static(__dirname + "/public"));

// const db = require("./utils/database");
const expenseRoutes = require("./routes/expenseRoutes");
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

(async () => {
  const connectionResult = await mongoose.connect(process.env.MONGO_URI);
  app.get("/", (req, res) => {
    res.redirect("/signup");
  });
  app.use("/expense", expenseRoutes);
  app.use("/signup", signupRoutes);
  app.use("/login", loginRoutes);
  app.use("/premium", premiumRoutes);
  app.use("/leaderboards", leaderboardRoutes);
  app.use("/password", passwordRoutes);
  app.use((req, res) => {
    res.sendFile(path.join(root, "views", "404.html"));
  });
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
})();
