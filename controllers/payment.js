const Razorpay = require("razorpay");

const { Payment } = require("../models/payment");
const { Company } = require("../models/user");

const instance = new Razorpay({
  key_id: "rzp_test_JXcaxpDmeAfOs4",
  key_secret: "FOWAABF5EXdMnYDKHgYWKeGF",
});

exports.makePayment = async (req, res) => {
  const options = {
    amount: 19900,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  try {
    const order = await instance.orders.create(options);
    res.json({ orderId: order.id, amount: 100 });
  } catch (error) {
    console.error(error);
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { orderId, paymentId, companyId } = req.body;
    if ((!orderId, paymentId, companyId)) {
      res.json("Missing required fields!");
    }

    const payment = new Payment({
      orderId,
      paymentId,
      transactionDate: new Date(),
      companyId,
      amount: 199,
    });

    const paymentResult = await payment.save();

    const companyResult = await Company.findByIdAndUpdate(companyId, {
      $set: { madePayment: true },
    });

    if (paymentResult && companyResult) {
      return res.status(201);
    } else {
      return res.status(500).json("Payment Failed");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.paymentCancelation = async (req, res) => {
  try {
    res.send("Payment Failed");
  } catch (error) {
    console.log(error);
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const result = await Payment.find().populate("companyId");

    if (!result) return res.json("Error fetching payement details!");

    const transformedPaymentData = result.map((payment) => {
      return transformPaymentData(payment);
    });

    return res.json(transformedPaymentData);
  } catch (error) {
    console.log(error);
  }
};

exports.totalPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    let totalAmount = 0;
    payments.forEach((payment) => {
      totalAmount += payment.amount;
    });
    res.status(200).json(totalAmount);
  } catch (error) {
    console.error("Error calculating total payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.salesByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const payments = await Payment.find({
      transactionDate: {
        $gte: new Date(currentYear, 0),
        $lt: new Date(currentYear + 1, 0),
      },
    });

    const salesByMonth = new Array(12).fill(0);
    payments.forEach((payment) => {
      const month = payment.transactionDate.getMonth();
      salesByMonth[month] += payment.amount;
    });

    res.status(200).json(salesByMonth);
  } catch (error) {
    console.error("Error retrieving sales by month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const transformPaymentData = (payment) => {
  if (payment) {
    return {
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      transactionDate: payment.transactionDate,
      amount: payment.amount,
      companyName: payment.companyId.companyName,
    };
  }
};
