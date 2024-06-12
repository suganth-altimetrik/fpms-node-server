const mongoose = require("mongoose");

const InvestModel = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId },
  asset_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchase_price: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("invest", InvestModel);
