const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// const comicsRoutes = require("./routes/comics");
// const comicIdRoutes = require("./routes/comicId");
// const charactersRoutes = require("./routes/characters");
// const characterIdRoutes = require("./routes/characterId");
// app.use(comicsRoutes);
// app.use(comicIdRoutes);
// app.use(charactersRoutes);
// app.use(characterIdRoutes);

const apiKey = process.env.API_KEY;

app.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

app.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${apiKey}`
    );
    res.json(response.data.results);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started ! ✅");
});
