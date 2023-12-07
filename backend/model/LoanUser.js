const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
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
  weekNum: {
    type: Number,
  },
  weekId:{
    type:String
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  loanApproval:{
    type:Boolean,
    default:false
  },
  loans: [
    {
      TotalAmount: Number,
      TotalWeek: Number,
      TotalDifference: Number,
      count: {
        type: Number,
        default: 0,
      },
      loadPending: {
        type: String,
        default: false,
      },
      week: [
        {
          weekNum: Number,
          Date: Date,
          amount: Number,

          Status: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});


const LoanUser = mongoose.model("User", UserSchema);
module.exports=LoanUser;