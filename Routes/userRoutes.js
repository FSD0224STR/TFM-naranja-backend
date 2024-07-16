const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
  verifyAdminUsers,
  deleteUser,
  updateUser,
  getDataUser,
  forgotPass,
  resetPass,
  mailResetPass,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/forgot", forgotPass);
UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.post("/reset-password/:id/:token", mailResetPass);
UsersRouter.get("/reset-password/:id/:token", resetPass);

UsersRouter.use(verifyToken);

UsersRouter.post("/getDataUser", getDataUser);
//UsersRouter.delete("/:user_id", isAdmin, deleteUser);
//UsersRouter.post("/forgot", isAdmin, forgotUser);
//UsersRouter.get("/:user_id", showDashboard);
UsersRouter.put("/:id", updateUser);
UsersRouter.delete("/:id", deleteUser);

module.exports = {
  UsersRouter,
};
