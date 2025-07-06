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


// Add this route BEFORE any express.json() middleware is applied
paymentRouter.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSignature = req.get("X-Razorpay-Signature");

      const isWebhookValid = validateWebhookSignature(
        req.body, // no need to stringify, it's already raw
        webhookSignature,
        "Naman@#8989"
      );

      if (!isWebhookValid) {
        return res.status(400).json({ msg: "Invalid webhook signature" });
      }

      const paymentDetails = JSON.parse(req.body).payload.payment.entity;

      const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

      if (payment) {
        payment.status = paymentDetails.status;
        await payment.save();

        const updatedUser = await user.findById(payment.userId);
        updatedUser.isPremium = true;
        updatedUser.membershipType = payment.notes.membershipType;
        await updatedUser.save();
      }

      return res.status(200).json({ msg: "Webhook processed" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
);





module.exports = paymentRouter; 