const { query } = require("express");
var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


//NEVER USED
// This path returns the details of a recipe by its id
router.get("/partialRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, false, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

//NEVER USED
// This path returns a full details of a recipe by its id
 router.get("/fullRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, true, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a list of 3 random recipes
router.get("/random", async (req, res, next) => {
  try {
    const results = await recipes_utils.getRandomRecipes();
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});


// This path returns a list of search results 
 router.get("/searchForRecipe/:query", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.searchForRecipe(req.params.query,  
      req.query.numberOfResults, req.query.cuisine, req.query.diet, req.params.intolerances);
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
