var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

// This path returns the details of a recipe by its id
router.get("/partialRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a full details of a recipe by its id
 router.get("/fullRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, true);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a list of 3 recipes by type 
 router.get("/threeRecipes/:typeOfRecipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getThreeRecipes(req.params.typeOfRecipes);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a list of search results 
 router.get("/searchForRecipe/:query", async (req, res, next) => {
  try {
    console.log(req.params.query)
    console.log(req.query.numberOfResults)
    console.log(req.query.cuisine)
    console.log(req.query.diet)
    console.log(req.query.intolerances)
  
    const recipe = await recipes_utils.searchForRecipe(req.params.query,  
      req.query.numberOfResults, req.query.cuisine, req.query.diet, req.query.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
