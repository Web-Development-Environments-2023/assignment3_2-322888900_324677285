const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

// FAVORITE
// sets favorites of user 
async function markAsFavorite(user_name, recipe_id){
    try{
        await DButils.execQuery(`insert into favorites values (${recipe_id}, '${user_name}')`);
    }
    catch(err){
       throw { status: 401, message: err };
    }
    
}

// gets favorites of user 
async function getFavoriteRecipes(user_name){
    try{
        const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}


// FAMILY
// get family recipes
async function getFamilyRecipesFromDb(user_name){
    try{

        const recipes_id = await DButils.execQuery(`select recipe_id from familyrecipes where user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

// add family recipe
async function addFamilyRecipeToDb(user_name, recipe_id, owner, when_to_cook, ingredients, instructions, photos){
    try{
        await DButils.execQuery(`insert into familyrecipes values ('${user_name}', '${recipe_id}', '${owner}', '${when_to_cook}', '${ingredients}', '${instructions}',' ${photos}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}


// MY RECIPES 
// insert new recipe to user
async function addRecipeToUser(parameters){
    try{
        const user_name = parameters.user_name
        const recipe_name = parameters.recipe_name
        const duration =  parameters.duration
        const image = parameters.image
        const popularity = parameters.popularity
        const vegan = parameters.vegan
        const vegetarian = parameters.vegetarian
        const glutenFree = parameters.glutenFree
        const instructions = parameters.instructions
        const extendedIngredients = parameters.extendedIngredients
        const servings = parameters.servings
        await DButils.execQuery(`insert into myrecipes values ( NULL, '${recipe_name}', ${duration}, '${image}', '${popularity}', ${vegan}, ${vegetarian}, ${glutenFree}, '${user_name}', '${extendedIngredients}', '${instructions}', '${servings}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}

// returns user's recipes
async function getUserRecipes(user_name){
    try{
       const recipes_id= await DButils.execQuery(`select recipe_id from myrecipes where user_name='${user_name}'`);
       return recipes_id; 
    }
    catch(err){
       throw { status: 400, message: err };
    }
    
}


// 3 LAST SEEN RECIPES
// get 3 last recipes information
async function getLastThreeRecipes(user_name, recipes_id){
    try{
        if(user_name === undefined){
            throw { status: 401, message: "undefined user" };
        }
        let recipes_data_list = []
        for(let i=0; i < recipes_id.length; i++ ){
            if (i === 3){
                break;
            }
            if(recipes_id[i] === undefined){
                continue
            }
            else{
                recipes_data_list.push( await recipes_utils.getRecipeDetails(recipes_id[i], false, false))
            }
        }
        return recipes_data_list
    }
    catch(err){
        throw { status: 401, message: err };
    }
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.getUserRecipes = getUserRecipes;
exports.addRecipeToUser = addRecipeToUser
exports.getLastThreeRecipes = getLastThreeRecipes