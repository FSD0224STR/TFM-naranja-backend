const { userModel } = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "orangefsd@gmail.com",
    pass: process.env.EMAIL_APP_PASS,
  },
});
/* const crypto = require("crypto"); */

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

    console.log("back", req.body.password);
    //send confirmation email
    const mailOptions = {
      from: "orangefsd@gmail.com",
      to: req.body.email,
      subject: "Tu cuenta ha sido creada con éxito",
      text: "This is a test email sent using Nodemailer.",
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
        }
        .footer {
            text-align: center;
            color: #999999;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a [Nombre de la Web]!</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Gracias por registrarte. Estamos emocionados de tenerte con nosotros.</p>
            <p>Por favor, confirma tu correo electrónico haciendo clic en el botón de abajo:</p>
            <a href="[URL de Confirmación]" class="button">Confirmar Correo Electrónico</a>
            <p>Si no te registraste en [Nombre de la Web], por favor ignora este correo.</p>
            <p>¡Esperamos que disfrutes de nuestros servicios!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Comparator40k. Todos los derechos reservados.</p>
            <p>OrangeFSD2024</p>
        </div>
    </div>
</body>
</html>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
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

const forgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;

    const mailOptions = {
      from: "orangefsd@gmail.com",
      to: req.body.email,
      subject: "Tu cuenta ha sido creada con éxito",
      text: "This is a test email sent using Nodemailer.",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
};

resetPass = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Found!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

mailResetPass = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
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
  forgotPass,
  resetPass,
  mailResetPass,
};
