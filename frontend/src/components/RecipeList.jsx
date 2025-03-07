import axios from "axios";
import { useEffect, useState } from "react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
    axios
      .get("https://recipe-backend-ecru.vercel.app/api/recipes")
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error(error));
  }, []);

  const toggleDetails = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  return (
    <div className="recipe-list-container">
      <h1>All Recipes</h1>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <h2>{recipe.title}</h2>
          <h3>{recipe.category}</h3>
          <button onClick={() => toggleDetails(recipe._id)}>
            {expandedRecipe === recipe._id ? "Hide details" : "More details"}
          </button>
          {expandedRecipe === recipe._id && (
            <div className="recipe-details">
              <p>Instructions:</p>
              <p>{recipe.instructions}</p>
              <p>Ingredients:</p>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
