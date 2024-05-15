const express = require("express");

const {
  loginUser,
  verifyToken,
  registerUser,
  isAdmin,
} = require("../Controllers/userController");
const UsersRouter = express.Router();

UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
<<<<<<< HEAD
//UsersRouter.post("/forgot", verifyToken, isAdmin, forgotUser);
//UsersRouter.get("/:user_id", verifyToken, showDashboard);
//UsersRouter.put("/:user_id", verifyToken, editUserData);
//UsersRouter.delete("/:user_id", verifyToken, isAdmin, deleteUser);
=======
UsersRouter.use(verifyToken);
//UsersRouter.post("/forgot", isAdmin, forgotUser);
//UsersRouter.get("/:user_id", showDashboard);
//UsersRouter.put("/:user_id", editUserData);
>>>>>>> 63c739af6b32d227571df3535459284fb16001da

module.exports = {
  UsersRouter,
};
