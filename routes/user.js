const express = require("express");
const router = express.Router();
const User = require("../models/User");

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/user/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();

    const receivedUser = await User.findOne({ email: email });

    if (receivedUser) {
      res.status(409).json({ error: { message: "Email déjà utilisé" } });
    } else if (!username || !email || !password) {
      res
        .status(400)
        .json({ error: { message: "Veuillez remplir tous les champs" } });
    } else {
      const salt = uid2(20);
      const hash = SHA256(salt + password).toString(encBase64);
      const token = uid2(64);
      const newUser = new User({
        email: email,
        username: username,
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();
      res.json({
        id: newUser._id,
        token: newUser.token,
        username: newUser.username,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    findUserByEmail = await User.findOne({ email: email });
    if (findUserByEmail) {
      console.log(findUserByEmail);
      const hash = SHA256(findUserByEmail.salt + password).toString(encBase64);
      if (hash === findUserByEmail.hash) {
        res.json({
          _id: findUserByEmail._id,
          token: findUserByEmail.token,
          username: findUserByEmail.username,
        });
      } else {
        res.status(401).json({ message: "Non autorisé" });
      }
    } else {
      res.status(401).json({ message: "Non autorisé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
