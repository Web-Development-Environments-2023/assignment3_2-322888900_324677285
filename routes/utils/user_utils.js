const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils")

// favorite recipes
async function markAsFavorite(user_name, recipe_id){
    try{
        await DButils.execQuery(`INSERT INTO favorites VALUES (${recipe_id}, '${user_name}')`);
    }
    catch(err){
       throw { status: 400, message: "This recipe is already in your favorites" };
    }
    
}


async function getFavoriteRecipes(user_name){
    try{
        const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favorites WHERE user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

// family recipes
async function getFamilyRecipesFromDb(user_name){
    try{

        const recipes = await DButils.execQuery(`SELECT * FROM familyrecipes WHERE user_name='${user_name}'`);
        return recipes;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

async function addFamilyRecipeToDb(user_name, recipe_id, owner, when_to_cook, ingredients, instructions, photos){
    try{
        await DButils.execQuery(`INSERT INTO familyrecipes VALUES ('${user_name}', '${recipe_id}', '${owner}', '${when_to_cook}', '${ingredients}', '${instructions}',' ${photos}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}

// Recentley viewed recipes
async function getLastSeenRecipes(user_name){
    try{
        let listOfRecipes = await DButils.execQuery(`SELECT * FROM lastseenrecipes WHERE user_name='${user_name}'`);       
        let response_body = {}
        response_body.FirstRecipe = null
        response_body.SecondRecipe = null
        response_body.ThirdRecipe = null
        if(listOfRecipes.length !== 0){
            if(listOfRecipes[0].first_recipe !== 'null'){ 
                let full_first_recipe = await recipes_utils.getRecipeDetails(listOfRecipes[0].first_recipe, false, false)
                response_body.FirstRecipe = full_first_recipe 
            }
            if(listOfRecipes[0].second_recipe !== 'null'){
                let full_second_recipe = await recipes_utils.getRecipeDetails(listOfRecipes[0].second_recipe, false, false)
                response_body.SecondRecipe = full_second_recipe 
            }
            if(listOfRecipes[0].third_recipe !== 'null'){
                let full_third_recipe = await recipes_utils.getRecipeDetails(listOfRecipes[0].third_recipe, false, false)
                response_body.ThirdRecipe = full_third_recipe 
            }
            return response_body
        }
        return response_body
    }
    catch(err){
        throw { status: 400, message: "No recently viewed recipes yet" };
    }
}

async function addLastSeenRecipes(user_name, Recipe){
    try{
        let listOfRecipes = await DButils.execQuery(`SELECT * FROM lastseenrecipes WHERE user_name='${user_name}'`);
        if(listOfRecipes.length === 0){
            await DButils.execQuery(`INSERT INTO lastseenrecipes VALUES ('${user_name}', '${null}','${null}','${Recipe}')`);
        }
        else{
            if(Recipe.toString() === listOfRecipes[0].first_recipe || Recipe.toString() === listOfRecipes[0].second_recipe || Recipe.toString() === listOfRecipes[0].third_recipe){
            }
            else if(listOfRecipes[0].first_recipe === 'null'){
                await DButils.execQuery(`UPDATE lastseenrecipes SET first_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
            else if(listOfRecipes[0].first_recipe !== 'null' && listOfRecipes[0].second_recipe === 'null'){
                await DButils.execQuery(`UPDATE lastseenrecipes SET second_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
            else if(listOfRecipes[0].second_recipe !== 'null' && listOfRecipes[0].third_recipe === 'null'){
                await DButils.execQuery(`UPDATE lastseenrecipes SET third_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
            else{
                await DButils.execQuery(`UPDATE lastseenrecipes SET first_recipe = '${listOfRecipes[0].second_recipe}', second_recipe = '${listOfRecipes[0].third_recipe}',third_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
        }
    }
    catch(err){
        throw { status: 400, message: "Couldn't add recipe to recentley seen" };
    }
}


async function addRecipeToUser(params){
    try{
        await DButils.execQuery(`INSERT INTO myrecipes (title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, user_name, ingredients, instructions, number_of_dishes) VALUES ('${params.recipe_name}','${params.duration}', '${params.image}', '${params.aggregateLikes}', '${params.vegan}', '${params.vegetarian}',' ${params.glutenFree}', "${params.user_name}",' ${params.extendedIngredients}','${params.instructions}',' ${params.servings}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}

async function getUserRecipes(user_name){
    try{
       let user_recipes =  await DButils.execQuery(`SELECT * FROM myrecipes WHERE user_name='${user_name}'`);
       return user_recipes
    }
    catch(err){
        throw { status: 401, message: err };
    }
}
exports.addLastSeenRecipes=addLastSeenRecipes;
exports.getLastSeenRecipes=getLastSeenRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.addFamilyRecipeToDb = addFamilyRecipeToDb;
exports.getUserRecipes=getUserRecipes;
exports.addRecipeToUser=addRecipeToUser