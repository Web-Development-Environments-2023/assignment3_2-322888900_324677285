var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) { 
  
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_name FROM users").then((users) => {
  
      if (users.find((x) => x.user_name === req.session.user_id)) {
        req.user_name = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


// FAVORITE
// This path returns a list of recipes 
router.get("/favorites", async (req, res, next) => {
  try {
    const user_name = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_name);  
    recipes_data_list = await push_recipe_data_to_list(recipes_id)
    res.status(200).send(recipes_data_list);
  } catch (error) {
    next(error);
  }
});

// This path adds a recipe to the favorites of the user
router.post("/favorites", async (req, res, next) => {
  try {
    const user_name = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    result_status = await user_utils.markAsFavorite(user_name, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});


// FAMILY
// This path returns a list of 3 family recipes 
router.get("/family", async (req, res, next) => {
  try {
    const results = await user_utils.getFamilyRecipesFromDb(req.session.user_id);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

// this path adds new family recipe to the db for a user
router.post("/family", async (req, res, next) =>{
  try {
    const user_name = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    const owner = req.body.recipe_owner;
    const when_to_cook = req.body.when_to_cook;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const photos = req.body.photos;
    await user_utils.addFamilyRecipeToDb(user_name, 
      recipe_id, owner, when_to_cook, ingredients, instructions, photos);
    res.status(200).send({ success: true, message: "Added new family recipe!" });
  } catch (error) {
    next(error);
  }
})


// MY RECIPES
// This path returns all user's recipes 
router.get("/myRecipes", async (req, res, next) => {
  try {
    const results = await user_utils.getUserRecipes(req.session.user_id);

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

// This path adds new recipe to the logged in user
router.post("/myRecipes", async (req, res, next) => {
  try {
    let params = {}
    params.user_name = req.session.user_id
    params.recipe_name = req.body.recipe_name
    params.duration =  req.body.duration
    params.image = req.body.image
    params.aggregateLikes = req.body.aggregateLikes
    params.vegan = req.body.vegan
    params.vegetarian = req.body.vegetarian
    params.glutenFree = req.body.glutenFree
    params.instructions = req.body.instructions
    params.extendedIngredients = req.body.extendedIngredients
    params.servings = req.body.servings
    await user_utils.addRecipeToUser(params);
    res.status(200).send("The recipe was successfully added");
  } catch (error) {
    next(error);
  }
});


// returns the last three seen recipes (id's) by the user
router.get("/lastSeenRecipes", async (req, res, next) =>{
  try {
    const user_name = req.session.user_id
    const results = await user_utils.getLastSeenRecipes(user_name);
    res.send(results);
    }
   catch (error) {
    next(error);
  }
})

// adds a recipe to last three seen recipes (id's) by the user
router.post("/lastSeenRecipes", async (req, res, next) =>{
  try {
    const user_name = req.session.user_id
    const recipe_id = req.body.recipe_id
    await user_utils.addLastSeenRecipes(user_name, recipe_id);
    res.status(200).send("Updated the last seen recipes");
    }
   catch (error) {
    next(error);
  }
})


// helper function
async function push_recipe_data_to_list(recipes_id_list){
  let recipes_list = []
  for(let i=0; i < recipes_id_list.length; i++ ){
      recipes_list.push( await recipes_utils.getRecipeDetails(recipes_id_list[i]["recipe_id"], false, false))
  }
  return recipes_list
}



module.exports = router;
