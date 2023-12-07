const User = require("../model/LoanUser");
const Admin = require("../model/shubhamAdmin");
const asyncHandler = require("express-async-handler");

const Register = asyncHandler(async (req, res) => {
  const { UserName, email, password } = req.body;
  if (!UserName || !email || !password) {
    res.status(400);
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    UserName,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
      loanApproval:false
    });
  } else {
    res.status(400);
    throw new Error("Fail to create new user");
  }
});

const AdminRegister = asyncHandler(async (req, res) => {
  const { UserName, email, password } = req.body;
  if (!UserName || !email || !password) {
    res.status(400);
  }
  const userExist = await Admin.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await Admin.create({
    UserName,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
      loanApproval:user.loanApproval
      //   token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail to create new user");
  }
});

const approvaButton=asyncHandler(async(req,res)=>{
    const {email} = req.params;
     const user = await User.findOne({ email });
      if (user) {
        res.json({
          loanApproval: true,
        });
      } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }

})

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && password) {
    res.json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
      loanApproval:user.loanApproval
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
const AdminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (user && password) {
    res.json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const UpdateLoanValue = asyncHandler(async (req, res) => {
  const { email, TotalAmount, TotalWeek } = req.body;

  try {
    // Use findOne to find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure that user.loans is an array
    if (!user.loans || !Array.isArray(user.loans)) {
      // Initialize user.loans as an empty array
      user.loans = [];
    }
    console.log(user.loanApproval)
   user.loanApproval=true;
    // Create a new object for the loan
    const newLoan = {
      TotalAmount,
      TotalWeek,
      // TotalDifference: TotalAmount - TotalWeek,
      week: [],
    };

    // Populate the week array with the specified number of entries
    const amountPerWeek = TotalAmount / TotalWeek;
    for (let i = 0; i < TotalWeek; i++) {
      const date = new Date();
      date.setDate(date.getDate() + 7 * i);

      newLoan.week.push({
        weekNum: i + 1,
        amount: amountPerWeek,
        Date: date,
        Status: false,
      });
    }

    // Add the new loan to the loans array
    user.loans.push(newLoan);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Loan updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const RequestAdmin = asyncHandler(async (req, res) => {
  const { email,CustomerName, CustomerEmail, CustomerAmount,CustomerWeek } = req.body;

  try {
    // Use findOne to find the user by email
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure that user.loans is an array
    if (!user.loansRequest || !Array.isArray(user.loansRequest)) {
      // Initialize user.loans as an empty array
      user.loansRequest = [];
    }

    // Create a new object for the loan
    const newLoan = {
      CustomerName,
      CustomerEmail,
      CustomerAmount,
      CustomerWeek,
      // TotalDifference: TotalAmount - TotalWeek,
    };



    // Add the new loan to the loans array
    user.loansRequest.push(newLoan);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Request added successfully to the bank" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//approval from admin





const particularPerson = asyncHandler(async (req, res) => {
  const { email } = req.params;

  try {
    // Use await with findOne
    const person = await User.findOne({ email });

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    // Handle the result as a Promise

    // res.status(200).json(person);
    // Extract and send only the 'loans' property
    const { loans } = person;
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const AllAdmin = asyncHandler(async (req, res) => {
  const { email } = req.params;

  try {
    // Use await with findOne
    const person = await Admin.findOne({ email });

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    // Handle the result as a Promise

    // res.status(200).json(person);
    // Extract and send only the 'loans' property
    const { loansRequest } = person;
    res.status(200).json(loansRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




const UpdateWeekStatus = asyncHandler(async (req, res) => {
  const { email, weekNum } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (weekNum >= 0 && weekNum < user.loans[0].week.length) {
      // Update the Status to true for the specific week
    user.loans[0].week[weekNum].Status = true;
      // Save the updated user document
      // user.count += 1;
      console.log(user.loans[0].TotalWeek);
      user.loans[0].count+=1;
      if (user.loans[0] && user.loans[0].count >= user.loans[0].TotalWeek) {
        user.loans[0].loadPending = true;
      }
      if(user.loans[0].TotalDifference-(user.loans[0].week[0].amount)>=0){
        user.loans[0].TotalDifference=user.loans[0].TotalDifference-(user.loans[0].week[0].amount);

      }
      else{
         user.loans[0].TotalDifference=0;
      }
      const savedUser = await user.save();
      return res
        .status(200)
        .json({
          success: true,
          message: `Status updated to true for week ${weekNum + 1}`,
          user: savedUser,
        });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Invalid week index" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});




module.exports = {
  Register,
  Login,
  UpdateLoanValue,
  particularPerson,
  UpdateWeekStatus,
  RequestAdmin,
  AllAdmin,
  AdminRegister,
  AdminLogin,
  approvaButton,
};