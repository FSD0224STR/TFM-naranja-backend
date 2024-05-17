const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
  isAdmin,
  deleteUser,
  updateUser,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);

UsersRouter.use(verifyToken);
//UsersRouter.post("/forgot", isAdmin, forgotUser);
//UsersRouter.get("/:user_id", showDashboard);
//UsersRouter.put("/:user_id", editUserData);
UsersRouter.delete("/:user_id", isAdmin, deleteUser);
UsersRouter.put("/:user_id", updateUser)


module.exports = {
  UsersRouter,
};
