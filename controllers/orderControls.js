const Razorpay = require("razorpay");
const Order = require("../models/order");
const sequelize = require("../utils/database");

const purchasepremium = async (req, res) => {
  const txn = await sequelize.transaction();
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    const order = await rzp.orders.create({ amount, currency: "INR" });
    await Order.create(
      { orderId: order.id, status: "PENDING" },
      { transaction: txn }
    );
    await txn.commit();
    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    await txn.rollback();
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  const txn = await sequelize.transaction();
  try {
    const userId = req.session.user_id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } }); //2
    await order.update(
      {
        paymentid: payment_id,
        status: "SUCCESSFUL",
      },
      {
        transaction: txn,
      }
    );
    await txn.commit();
    await req.session.user.update(
      { isPremiumUser: true },
      { transaction: txn }
    );
    await txn.commit();
    return res.status(201).json({
      message: "Transaction Successful",
    });
  } catch (err) {
    await txn.rollback();
    console.log(err);
    res.status(403).json({ errpr: err, message: "Something went wrong" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
