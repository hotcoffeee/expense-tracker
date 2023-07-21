// const User = require("../models/user");
const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");

exports.buyPremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    const order = await rzp.orders.create({ amount, currency: "INR" });
    await Order.create({
      orderId: order.id,
      status: "PENDING",
      userId: req.session.userId,
    });
    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.isPremium = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.json({ isPremiumUser: user.isPremiumUser });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { payment_id, order_id } = req.body;
    await Promise.all([
      Order.findOneAndUpdate(
        { orderId: order_id },
        {
          paymentid: payment_id,
          status: "SUCCESSFUL",
        }
      ),
      User.findByIdAndUpdate(userId, { isPremiumUser: true }),
    ]);
    return res.status(201).json({
      message: "Transaction Successful",
      redirect: "/expense",
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Something went wrong" });
  }
};
