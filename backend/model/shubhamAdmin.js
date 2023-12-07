const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  UserName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },

  loansRequest: [
    {
      CustomerName: String,
      CustomerEmail: String,
      CustomerAmount: Number,
      CustomerWeek:Number,
      Approval:Boolean
    },
  ],
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;