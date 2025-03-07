const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  category: { type: String },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Recipe', RecipeSchema);