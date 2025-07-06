const express = require("express");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const user = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { membershipAmount } = require("../utils/constants");

// 🔁 Routers
const routerForOthers = express.Router();
const routerForWebhook = express.Router();

// ✅ Payment creation route (JSON body)
routerForOthers.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: "rzp_test_xmgnk9VG3mQxVU" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// ✅ Razorpay Webhook route (RAW body)
routerForWebhook.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    console.log("📩 Webhook called");

    const signature = req.get("X-Razorpay-Signature");
    const isValid = validateWebhookSignature(
      req.body,
      signature,
      "Naman@#797999"
    );

    if (!isValid) {
      console.log("❌ Invalid signature");
      return res.status(400).json({ msg: "Invalid signature" });
    }

    const parsed = JSON.parse(req.body);
    const paymentData = parsed.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentData.order_id });
    if (payment) {
      payment.status = paymentData.status;
      await payment.save();

      const User = await user.findById(payment.userId);
      if (User) {
        User.isPremium = true;
        User.membershipType = payment.notes.membershipType;
        await User.save();
        console.log("✅ Payment & User updated");
      }
    }

    return res.status(200).json({ msg: "Webhook processed" });
  } catch (err) {
    console.error("🔥 Webhook error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
});

routerForOthers.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  console.log(user);
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

module.exports = {
  routerForWebhook,
  routerForOthers,
};
