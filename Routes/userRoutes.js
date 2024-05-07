const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", verifyToken, loginUser);
// UsersRouter.post("/forgot", forgotUser);
// UsersRouter.get("/:user_id", verifyToken, showDashboard);
// UsersRouter.put("/:user_id", editUserData);
// UsersRouter.delete("/:user_id", deleteUser);

module.exports = {
  UsersRouter,
};
