const express = require("express");
const {
  Login,
  Register,
  UpdateLoanValue,
  particularPerson,
  UpdateWeekStatus,
  RequestAdmin,
  AllAdmin,
  AdminRegister,
  AdminLogin,
  approvaButton,
} = require("../Controllers/UserController");
const router = express.Router();
router.post("/login", Login);
router.post("/AdminLogin", AdminLogin);
router.post("/register", Register);
router.post("/Adminregister", AdminRegister);
router.post("/setLoan", UpdateLoanValue);
router.get("/person/:email", particularPerson);
router.post("/weeknum/:email/:weekNum", UpdateWeekStatus);
router.post("/requesttobank", RequestAdmin);
router.get("/alladmin/:email", AllAdmin);
// router.post("/approvalButton/:email", approvaButton);
router.get("/approvalButton/:email", approvaButton);

module.exports = router;