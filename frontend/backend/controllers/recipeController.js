const Recipe = require("../models/Recipe");

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, tags } = req.body;
    const newRecipe = await Recipe.create({ title, ingredients, steps, tags, createdBy: req.user.id });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name");
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
