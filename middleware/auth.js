const jwt = require("jsonwebtoken");
const User = require("../models/users");
const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  try {
    const { userId } = jwt.verify(authorization, "hihihi");
    if (userId) req.user = userId;
    else return res.status(201).json({ msg: "Invalid id" });
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "you must be logged in" });
  }
};
module.exports = auth;
