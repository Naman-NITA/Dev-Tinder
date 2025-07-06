const express = require("express");
const { userAuth } = require("../middlewares/auth");

const razorpayInstance = require("../utils/razorpay")

const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const user = require("../models/user");




const paymentRouter = express.Router();

paymentRouter.post("/payment/create" ,userAuth , async(req,res) => {

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
        membershipType: membershipType,
      },
    });

    

    // Save it in my database
    // console.log(order);

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

    // // Return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: "rzp_test_xmgnk9VG3mQxVU" });
      

       
    

    

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


paymentRouter.post(
  "/payment/webhook", async (req, res) => {
    try {
      console.log("📩 Webhook Called");

      const webhookSignature = req.get("X-Razorpay-Signature");
      console.log("🔐 Webhook Signature:", webhookSignature);

      const isWebhookValid = validateWebhookSignature(
        req.body, // raw buffer
        webhookSignature,
        "Naman@#797999"
      );

      if (!isWebhookValid) {
        console.log("❌ Invalid Webhook Signature");
        return res.status(400).json({ msg: "Webhook signature is invalid" });
      }

      const parsedBody = JSON.parse(req.body);
      const paymentDetails = parsedBody.payload.payment.entity;

      console.log("💳 Payment Details:", paymentDetails);

      const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

      if (payment) {
        payment.status = paymentDetails.status;
        await payment.save();
        console.log("💾 Payment updated");

        const User = await user.findById(payment.userId);
        if (User) {
          User.isPremium = true;
          User.membershipType = payment.notes.membershipType;
          await User.save();
          console.log("👤 User updated");
        }
      }

      return res.status(200).json({ msg: "Webhook processed" });
    } catch (err) {
      console.error("🔥 Error:", err.message);
      return res.status(500).json({ msg: err.message });
    }
  }
);





module.exports = paymentRouter; 