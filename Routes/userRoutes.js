const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
  isAdmin,
  deleteUser,
  updateUser,
  verifyAdmin,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.post("/verifyAdmin", verifyAdmin);

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
