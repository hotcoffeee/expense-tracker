const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  orderId: String,
  paymentid: String,
  status: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Order", orderSchema);
