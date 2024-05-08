const express = require("express");

const {  loginUser, verifyToken, registerUser, isAdmin } = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.post("/forgot", verifyToken, isAdmin, forgotUser);
UsersRouter.get("/:user_id", verifyToken, showDashboard);
UsersRouter.put("/:user_id", verifyToken, editUserData);
UsersRouter.delete("/:user_id", verifyToken, isAdmin, deleteUser);

module.exports = {
  UsersRouter,
};
