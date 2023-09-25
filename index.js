const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
app.use(userRoutes);

const favoritesRoutes = require("./routes/favoriteCharacters");
app.use(favoritesRoutes);

const apiKey = process.env.API_KEY;

app.get("/comics", async (req, res) => {
  try {
    // const title = req.query.title || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "50";

    const response = await axios.get(
      `https://gateway.marvel.com:443/v1/public/comics?limit=${limit}&apiKey=${apiKey}&skip=${skip}` //comics &title=${title}
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    const characterId = req.params.characterId;

    const response = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?limit=50&apikey=${apiKey}` //comics/:characterId
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    // const name = req.query.name || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "50";

    const response = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}&apikey=bd6b86b57fc6c0f6d8aca97ead79e660&skip=${skip}` //&name=${name}
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started ! ✅");
});
