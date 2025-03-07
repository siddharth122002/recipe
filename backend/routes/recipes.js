const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ order: 1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const ensureUncategorizedCategory = async () => {
  let uncategorized = await Category.findOne({ category: "Uncategorized" });
  if (!uncategorized) {
    uncategorized = new Category({ category: "Uncategorized", recipes: [] });
    await uncategorized.save();
  }

  return uncategorized;
};

// POST new recipe
router.post("/",
  [
    body("title").not().isEmpty(),
    body("ingredients").isArray({ min: 1 }),
    body("instructions").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, instructions, category } = req.body;

    try {
      // Ensure "Uncategorized" category exists
      const uncategorizedCategory = await ensureUncategorizedCategory();
      
      // Create the recipe
      const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        category: category || "Uncategorized", // Default to "Uncategorized" if no category is provided
      });
    
      // Save the recipe
      const savedRecipe = await recipe.save();
      console.log(savedRecipe)
      if (!category) {
        uncategorizedCategory.recipe.push(savedRecipe._id);
        await uncategorizedCategory.save();
      }
      

      res.status(201).json(savedRecipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT to update recipe
router.put('/:id', async (req, res) => {
  try {
    // console.log(req.body)
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/categorize', async (req, res) => {
  const { newCategory } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ category: newCategory });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    console.log("---------")
    // If the category doesn't exist, create it
    const savedCategory = await Category.create({
      category: newCategory,
    });

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all categories with their recipes
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().populate("recipe"); // Populate the recipes array
    // console.log(categories)
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// PUT to update a recipe's category
router.put("/:id/category", async (req, res) => {
  const { id } = req.params;
  const { newCategory } = req.body;

  try {
    // Update the recipe's category
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { category: newCategory },
      { new: true }
    );

    // Remove the recipe from the old category
    await Category.updateMany(
      { recipe: id },
      { $pull: { recipe: id } }
    );

    // Add the recipe to the new category
    await Category.findOneAndUpdate(
      { category: newCategory },
      { $push: { recipe: id } },
      { upsert: true } // Create the category if it doesn't exist
    );

    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;