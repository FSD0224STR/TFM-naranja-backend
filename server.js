require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { UsersRouter } = require("./Routes/userRoutes");
const { ProductsRouter } = require("./Routes/productsRoutes");

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

app.use(cors());
app.use(express.json());

app.use("/users", UsersRouter);
app.use("/products", ProductsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
