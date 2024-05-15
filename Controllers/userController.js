const { userModel } = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/* const crypto = require("crypto"); */
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
const tokenSecret = process.env.TOKEN_SECRET;

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {

      const recaptchaResponse = req.body.recaptchaResponse;
    const captchaValidationResult = await verifyRecaptcha(recaptchaResponse);

    if (!captchaValidationResult.success) {
      return res.status(400).json({ error: 'Invalid CAPTCHA response' });
    }
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
      const recaptchaResponse = req.body.recaptchaResponse;
    const captchaValidationResult = await verifyRecaptcha(recaptchaResponse);
    
    if (!captchaValidationResult.success) {
        return res.status(400).json({ error: 'Invalid CAPTCHA response' });
    }
    console.log("back", req.body.email);
    /*     const tokenSecret = crypto.randomBytes(32).toString("hex"); */
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

<<<<<<< HEAD
const verifyRecaptcha = async (recaptchaResponse) => {
    const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
            params: {
                secret: recaptchaSecretKey,
                response: recaptchaResponse,
            },
        }
    );
    return response.data;
=======
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
>>>>>>> d30d72e29671793a769b85ea86da05b8ea44a448
};

const updateUser = async (req, res) => {
    try {
        const { name, password } = req.body
        const userToUpdate = await userModel.findById (req.params.id);
        if (!userToUpdate) {
            return res.status(404).json({ error: "Usuario no encontrado"})
        }
        if (name) userToUpdate.name = name;
        if (password) {
            const hashedPassword = await bcrypt.hash (password, 10);
            userToUpdate.password = hashedPassword;
        }
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
};
