var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns the details of a recipe by its id
 */
router.get("/partialRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/fullRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, true);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a list of 3 recipes by type 
 */
 router.get("/threeRecipes/:typeOfRecipes", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getThreeRecipes(req.params.typeOfRecipes);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a list of search results 
 */
 router.get("/searchForRecipe/:query", async (req, res, next) => {
  try {
    //, req.params.numberOfResults, req.params.cuisine, 
    const recipe = await recipes_utils.searchForRecipe(req.params.query);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
