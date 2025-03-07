import axios from "axios";
import React, { useEffect, useState } from "react";

function Categorize() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/recipes/categories"
        );

        setCategories(response.data);
      } catch (error) {
        console.error("----:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/recipes/categorize",
          { newCategory }
        );

        setCategories([...categories, { category: newCategory, recipe: [] }]);
        setNewCategory("");
        setShowAddCategory(false);
      } catch (e) {
        alert("Already exists");
      }
    }
  };

  // Handle drag start
  const handleDragStart = (e, recipe, category) => {
    setDraggedRecipe({ ...recipe, sourceCategory: category });
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle drop
  const handleDrop = async (e, targetCategory) => {
    e.preventDefault();

    if (draggedRecipe && draggedRecipe.sourceCategory !== targetCategory) {
      try {
        // Update the recipe's category in the backend
        await axios.put(
          `http://localhost:3000/api/recipes/${draggedRecipe._id}/category`,
          {
            newCategory: targetCategory,
          }
        );

        // Update the UI
        const updatedCategories = categories.map((cat) => {
          if (cat.category === draggedRecipe.sourceCategory) {
            // Remove the recipe from the source category
            return {
              ...cat,
              recipe: cat.recipe.filter((r) => r._id !== draggedRecipe._id),
            };
          } else if (cat.category === targetCategory) {
            // Add the recipe to the target category
            return {
              ...cat,
              recipe: [...cat.recipe, draggedRecipe],
            };
          }
          return cat;
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error updating recipe category:", error);
      }
    }
  };

  return (
    <div className="categorize-container">
      <h1>Categories</h1>

      {/* Button to add a new category */}
      <button onClick={() => setShowAddCategory(!showAddCategory)}>
        Add New Category
      </button>

      {/* Input field for adding a new category */}
      {showAddCategory && (
        <div className="add-category-form">
          <input
            type="text"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add</button>
        </div>
      )}

      {/* Display categories in columns */}
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category.category)}
          >
            <h2>{category.category}</h2>
            <ul>
              {category.recipe.map((recipe, recipeIndex) => (
                <li
                  key={recipeIndex}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, recipe, category.category)
                  }
                >
                  {recipe.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categorize;
