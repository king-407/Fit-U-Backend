const User = require("../models/users");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendMail = async (name, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "shivamtiwaritiwari0704@gmail.com",
        pass: process.env.SMTP_ACCESS,
      },
    });
    const mailOptions = {
      from: "shivamtiwaritiwari0704@gmail.com",
      to: email,
      subject: "For verification",
      html: "<p> Hii " + name + " ,Welcone to Fit-U",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });
  } catch (e) {}
};
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email | !email || !password) {
      return res.status(200).send("Please provide details");
    }
    const person = await User.findOne({ email: req.body.email });
    if (person) {
      return res.status(202).json({ msg: "User with email exists exists" });
    }
    const user = new User({
      name,
      email,
      password,
    });
    user
      .save()
      .then((created) => {
        // sendMail(req.body.name, req.body.email);
        res.status(201).json({ msg: "Registeration successfull" });
      })
      .catch((err) => {
        res.status(500).json({ error: err, success: false });
      });
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      if (password == user.password) {
        console.log(user);
        const token = jwt.sign({ userId: user._id }, "hihihi");
        res.status(201).json({ token });
      } else {
        return res.status(200).json({ error: "Wrong credentials" });
      }
    } else {
      return res.status(200).json({ error: "Wrong credentials" });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
