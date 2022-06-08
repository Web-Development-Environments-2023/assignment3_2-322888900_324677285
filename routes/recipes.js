var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

router.get("/", (req, res) => res.send("im here"));

// This path returns the details of a recipe by its id
router.get("/partialRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, false, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a full details of a recipe by its id
 router.get("/fullRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, true, false);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// This path returns a list of 3 recipes by type 
 router.get("/threeRecipes/:typeOfRecipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getThreeRecipes(req.params.typeOfRecipe);
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
      req.query.numberOfResults, req.query.cuisine, req.query.diet, req.params.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// This path adds a recipe to the favorites of the user
// TODO - figure out how to get the user name from the cookie session.
router.post("/addToFavorites/:recipe_id", async (req, res, next) => {
  try {
    console.log(req.session)
    const recipe = await user_utils.markAsFavorite(req.session.user_id, req.params.recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
