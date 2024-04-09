const express = require("express");

const checkAuth = require("../middleware/check-auth");
const paymentController = require("../controllers/payment");

const router = express.Router();

router.post("/createOrder", checkAuth, paymentController.makePayment);

router.post("/success", checkAuth, paymentController.paymentSuccess);

router.get("/cancle", checkAuth, paymentController.paymentCancelation);

router.get("/payment-details", checkAuth, paymentController.getPaymentDetails);

router.get("/total-payments", checkAuth, paymentController.totalPayments);

router.get("/sales-month", checkAuth, paymentController.salesByMonth);

module.exports = router;
