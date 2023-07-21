// const db = require("../utils/database");
// const Sequelize = require("sequelize");

// module.exports = PasswordResetRequest;
const { Schema, model } = require("mongoose");

const passwordResetRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id: {
    required: true,
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("PasswordResetRequest", passwordResetRequestSchema);
