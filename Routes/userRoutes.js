const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
  isAdmin,
  deleteUser,
  updateUser,
  verifyAdmin,
  forgotPass,
  resetPass,
  mailResetPass,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/forgot", forgotPass);
UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.post("/verifyAdmin", verifyAdmin);
UsersRouter.post("/reset-password/:id/:token", mailResetPass);
UsersRouter.get("/reset-password/:id/:token", resetPass);

UsersRouter.use(verifyToken);

//UsersRouter.delete("/:user_id", isAdmin, deleteUser);
//UsersRouter.post("/forgot", isAdmin, forgotUser);
//UsersRouter.get("/:user_id", showDashboard);
UsersRouter.put("/:id", updateUser);
UsersRouter.delete("/:user_id", isAdmin, deleteUser);
UsersRouter.put("/:user_id", updateUser);

module.exports = {
  UsersRouter,
};
