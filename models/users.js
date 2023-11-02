const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
