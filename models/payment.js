const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  transactionDate: { type: Date, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  amount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = {
  Payment: Payment,
};
