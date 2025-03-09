// const mongoose = require("mongoose");

// const connectionRequestSchema = new mongoose.Schema({
//   fromUserId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   toUserId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: {
//       values : ["ignored", "interested", "accepeted", "rejected"],
//       message : `{VALUE} is incorrect status type`
//     },
//   },
// }, 

// {
//   timestamps: true,
// });


// // connectionRequestSchema.pre("save", function (next) {
// //   const connectionRequest = this;

// //   // Check if the fromUserId is the same as toUserId
// //   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
// //     return next(new Error("Cannot send connection request to yourself!"));
// //   }

  
// // });



// const ConnectionRequestModel = mongoose.model(
//   "ConnectionRequest",
//   connectionRequestSchema
// );

// module.exports = ConnectionRequestModel;
 

    