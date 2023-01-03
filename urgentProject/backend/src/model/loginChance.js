const mongoose = require("mongoose");
const loginChanceSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
    },

    userId: {
      type: String,
    },

    expireTime: {
      type: Date,
      expires: "24h",
      default: Date.now(),
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Login Chance", loginChanceSchema);
