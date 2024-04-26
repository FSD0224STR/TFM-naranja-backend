const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");

const port = process.env.PORT || 5000;

app.use(cors());

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    console.log("MongoDB Esta connectada!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", userRoutes);
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
