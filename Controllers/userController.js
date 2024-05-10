const { userModel } = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tokenSecret = "prueba"; //process.env.TOKEN_SECRET;

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
    await jwt.verify(token, tokenSecret);
    next();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  res.status(400).json("No estas autorizado para ver este recurso");
};

const registerUser = async (req, res) => {
  try {

    console.log("back", req.body.email);
    const tokenSecret = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    console.log("back", hashedPassword);

    const newUser = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
      secret: tokenSecret,
    });

    console.log("back", req.body.password);

    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyToken,
  isAdmin,
};
