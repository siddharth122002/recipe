import React, { useState } from "react";
import axios from "axios";

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await axios.post(
        "https://recipe-backend-ecru.vercel.app/api/recipes",
        formData
      );
      alert("Recipe added successfully!");
      setFormData({
        title: "",
        ingredients: [],
        instructions: "",
        category: "",
      }); // Clear form
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recipe-form-container">
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={formData.ingredients.join(",")}
          onChange={(e) =>
            setFormData({ ...formData, ingredients: e.target.value.split(",") })
          }
        />
        <textarea
          placeholder="Instructions"
          value={formData.instructions}
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RecipeForm;
