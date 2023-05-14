const mongoose = require("mongoose");

const FavoriteCharacters = mongoose.model("FavoriteCharacters", {
  name: String,
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  characterId: String,
  userId: String,
});

module.exports = FavoriteCharacters;
