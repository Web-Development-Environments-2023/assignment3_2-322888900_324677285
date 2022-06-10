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
// This path returns a list of 3 recipes by type 
router.get("/favorites", async (req, res, next) => {
  try {
    const user_name = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_name);  
    recipes_data_list = await push_recipe_data_to_list(recipes_id)
    console.log(recipes_data_list)
    res.status(200).send(recipes_data_list);
  } catch (error) {
    next(error);
  }
});

// This path adds a recipe to the favorites of the user
router.post("/favorites/:recipe_id", async (req, res, next) => {
  try {
    const user_name = req.session.user_id;
    const recipe_id = req.params.recipe_id;
    await user_utils.markAsFavorite(user_name, recipe_id);
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
    res.send({ success: true, message: "Added new family recipe!" });
  } catch (error) {
    next(error);
  }
})


// helper function
async function push_recipe_data_to_list(recipes_id_list){
  let recipes_list = []
  for(let i=0; i < recipes_id_list.length; i++ ){
      if (i === 3){
          break;
      }
      recipes_list.push( await recipes_utils.getRecipeDetails(recipes_id_list[i]["recipe_id"], false, false))
  }
  return recipes_list
}

module.exports = router;
