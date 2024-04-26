const express = require("express");

const { getUser, loginUser } = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.post("/forgot", forgotUser);
UsersRouter.get("/userDashboard/:user_id", showDashboard);
UsersRouter.put("/editUserPanel/:user_id", editUserData);
UsersRouter.delete("/:user_id", deleteUser);

module.exports = {
  UsersRouter,
};
