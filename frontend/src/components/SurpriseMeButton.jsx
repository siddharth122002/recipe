import React, { useState } from "react";
import axios from "axios";

const SurpriseMeButton = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRandomRecipe = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/recipes");
      const recipes = response.data;
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setRandomRecipe(recipes[randomIndex]);
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRandomRecipe(null); // Clear the random recipe
  };

  return (
    <div className="surprise-me-container">
      <p className="surp" onClick={fetchRandomRecipe}>
        Surprise Me!
      </p>

      {/* Modal for displaying the random recipe */}
      {showModal && randomRecipe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>{randomRecipe.title}</h2>
            <h3>Instructions:</h3>
            <p>{randomRecipe.instructions}</p>
            <h3>Ingredients:</h3>
            <ul>
              {randomRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurpriseMeButton;
