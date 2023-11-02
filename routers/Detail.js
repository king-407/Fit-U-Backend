const Detail = require("../models/Detail");
const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();
router.get("/avg", auth, async (req, res) => {
  const uid = req.user;
  try {
    const totalInfo = await Detail.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(uid), // Filter the documents by the specified userId
        },
      },
      {
        $group: {
          _id: null, // We use null to group all filtered documents into one group
          Water: { $avg: "$water" }, // Calculate the average of 'field1'
          Cycle: { $avg: "$cycle" },
          Sleep: { $avg: "$sleep" },
          Walk: { $avg: "$walk" },
          // Calculate the average of 'field2'
          // Add more fields here if you want to calculate averages for additional fields
        },
      },
    ]);
    if (totalInfo.length == 0) {
      return res.status(200).json({ message: "You need to start" });
    }
    console.log(totalInfo);
    res.status(200).json({
      water: Math.round((totalInfo[0].Water * 100) / 100),
      cycle: Math.round((totalInfo[0].Cycle * 100) / 100),
      sleep: Math.round((totalInfo[0].Sleep * 100) / 100),
      walk: Math.round((totalInfo[0].Walk * 100) / 100),
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/get", auth, async (req, res) => {
  try {
    const result = await Detail.find({ user: req.user });
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});
router.get("/get/:entry", auth, async (req, res) => {
  const ent = req.params.entry;
  const result = await Detail.find({ user: req.user }).select(`${ent} day`);
  res.status(200).send(result);
});
router.post("/", auth, async (req, res) => {
  const { cycle, walk, sleep, water } = req.body;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  const day = daysOfWeek[d.getDay()];

  try {
    const detail = new Detail({
      user: req.user,
      cycle,
      walk,
      sleep,
      water,
      day,
      exp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    detail
      .save()
      .then((created) => {
        res.status(201).send(created);
      })
      .catch((err) => {
        res.status(500).json({ error: err, success: false });
      });
  } catch (e) {}
});
module.exports = router;
