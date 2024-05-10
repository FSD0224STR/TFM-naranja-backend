const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    birthday: { type: Date, require: false },
    isAdmin: Boolean,
  },
  { timestamps: true }
);
const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
};
