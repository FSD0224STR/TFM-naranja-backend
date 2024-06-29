const { userModel } = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tokenSecret = process.env.TOKEN_SECRET;

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await userModel.findOne({ email: email });
    if (!userFound) return res.status(404).json("User not found");

    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) return res.status(401).json("Invalid password");

    const token = jwt.sign({ email: userFound.email }, tokenSecret, {
      expiresIn: "7 days",
    });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, tokenSecret);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  res.status(400).json("No estas autorizado para ver este recurso");
};

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
      secret: tokenSecret,
      isAdmin: false,
    });

    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;

    const userIdToDelete = req.params.id;

    const userToDelete = await userModel.findById(userIdToDelete);

    if (!userToDelete) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (isAdmin || userIdToDelete === req.user._id) {
      await userToDelete.remove();
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } else {
      return res
        .status(403)
        .json({ error: "No tienes permiso para realizar esta acción" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToUpdate = await userModel.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  try {
    await userModel.findByIdAndUpdate(id, req.body);
    res.json({
      message: "Usuario actualizado correctamente",
      user: userToUpdate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const userFound = await userModel.findOne({ email: email });
    if (!userFound) return res.status(404).json("User not found");

    res.status(200).json(userFound.isAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyToken,
  isAdmin,
  deleteUser,
  updateUser,
  verifyAdmin,
};
