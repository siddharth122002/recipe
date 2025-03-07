import React from "react";
import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/RecipeForm";
import SurpriseMeButton from "./components/SurpriseMeButton";
import "./index.css";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Categorize from "./components/Categorize";
import Logo from "./components/Logo";
import Sparkles from "./components/Sparkles";
const App = () => {
  return (
    <Router>
      <div className="parent">
        <nav className="nav">
          <Link className="link" to={"/"}>
            <div className="recipe">
              <Logo />
              <p>
                Recipe<span className="joy">Joy</span>
              </p>
            </div>
          </Link>
          <div className="texts">
            <Link className="link text-color" to={"/"}>
              Recipes
            </Link>

            <Link className="link text-color" to={"/create"}>
              Create
            </Link>

            <Link className="link text-color" to={"/categorize"}>
              Categorize
            </Link>
          </div>
          <div className="sparkle-parent">
            <Sparkles />
            <SurpriseMeButton />
          </div>
        </nav>
      </div>
      <div className="body-routes">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/create" element={<RecipeForm />} />

          <Route path="/categorize" element={<Categorize />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
