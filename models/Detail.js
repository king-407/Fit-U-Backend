const mongoose = require("mongoose");
const detailSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  cycle: {
    type: Number,
    default: 0,
  },
  sleep: {
    type: Number,
    default: 0,
  },
  walk: {
    type: Number,
    default: 0,
  },
  water: {
    type: Number,
    default: 0,
  },
  day: {
    type: "String",
    default: 0,
  },
  exp: {
    type: Date,
    required: true,
    index: { expires: "7d" },
  },
});

module.exports = mongoose.model("Detail", detailSchema);
