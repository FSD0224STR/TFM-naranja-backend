require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { UsersRouter } = require("./Routes/userRoutes");
const { ProductsRouter } = require("./Routes/productsRoutes");
const { CategoriesRouter } = require("./Routes/categoryRoutes");

const port = process.env.PORT || 3000;

const mongoDB =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.DB_SERVER +
  "/" +
  process.env.DB_NAME +
  "?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB)
  .then((result) => {
    console.log("MongoDB Esta connectada!");
  })
  .catch((err) => {
    console.log(err);
  });

const allowedOrigins = [
  "http://localhost:3000",
  "https://joyful-cannoli-082812.netlify.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (como las hechas por el propio servidor)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor socket.io activo");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { configSocket } = require("./Websockets/Socket");
configSocket(io);

module.exports = { io };

app.use("/users", UsersRouter);
app.use("/products", ProductsRouter);
app.use("/categories", CategoriesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

server.listen(port, () => console.log(`Socket started on port ${port}`));
