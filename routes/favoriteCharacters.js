const express = require("express");
const router = express.Router();
const FavoriteCharacters = require("../models/FavoriteCharacters");
const User = require("../models/User");

router.post("/characters/favorite", async (req, res) => {
  try {
    let { name, description, image, userId, characterId } = req.body;

    const favoritedCharacter = await FavoriteCharacters.findOne({
      userId,
      characterId,
    });

    const userExists = await User.findOne({
      _id: userId,
    });

    if (favoritedCharacter) {
      res
        .status(409)
        .json({ error: { message: "Character already favorited" } });
    } else if (!userId || !characterId || !name) {
      res.status(400).json({ error: { message: "Missing Parameters" } });
    } else if (!userExists) {
      res.status(400).json({ error: { message: "User does not exist" } });
    } else {
      const newFavoriteCharacter = new FavoriteCharacters({
        name,
        description,
        image,
        userId,
        characterId,
      });
      await newFavoriteCharacter.save();
      res.status(201).json(newFavoriteCharacter);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/characters/favorite", async (req, res) => {
  try {
    const { userId, characterId } = req.body;
    const favoritedCharacter = await FavoriteCharacters.findOne({
      userId,
      characterId,
    });
    if (!favoritedCharacter) {
      res.status(404).json({ message: "favorite not found" });
    } else {
      await favoritedCharacter.deleteOne(favoritedCharacter._id);
      res.status(204).json();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/characters/favorite/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userExists = await User.findOne({
      _id: userId,
    });
    if (userExists) {
      const favoritedCharacter = await FavoriteCharacters.find({
        userId,
      });
      res.status(200).json(favoritedCharacter);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// to do: outra rota (get)
// receber o userId e retornar todos os favoritedCharacters relacionados a esse userId
// DIca: find recebendo userId

module.exports = router;
