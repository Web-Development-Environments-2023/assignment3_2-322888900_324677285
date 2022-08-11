const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils")

// favorite recipes
async function markAsFavorite(user_name, recipe_id){
    try{
        await DButils.execQuery(`INSERT INTO favorites VALUES (${recipe_id}, '${user_name}')`);
    }
    catch(err){
       throw { status: 401, message: err };
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
        console.log("in server function")
        let listOfRecipes = await DButils.execQuery(`SELECT * FROM lastseenrecipes WHERE user_name='${user_name}'`);
        console.log("the recipes are:")
        console.log(listOfRecipes)
        console.log("length of response is:")
        console.log(listOfRecipes.length)
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
            console.log("response is:")
            console.log(response_body)
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
            console.log("empty array")
            await DButils.execQuery(`INSERT INTO lastseenrecipes VALUES ('${user_name}', '${Recipe}','${null}','${null}')`);
        }
        else{
            if(Recipe.toString() === listOfRecipes[0].first_recipe || Recipe.toString() === listOfRecipes[0].second_recipe || Recipe.toString() === listOfRecipes[0].third_recipe){
                console.log("Recipe is already in recentley viewed")
            }
            else if(listOfRecipes[0].first_recipe !== 'null' && listOfRecipes[0].second_recipe === 'null'){
                console.log("has one recipe")
                await DButils.execQuery(`UPDATE lastseenrecipes SET second_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
            else if(listOfRecipes[0].second_recipe !== 'null' && listOfRecipes[0].third_recipe === 'null'){
                console.log("has two recipes")
                await DButils.execQuery(`UPDATE lastseenrecipes SET third_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
            else{
                console.log("has three recipes")
                await DButils.execQuery(`UPDATE lastseenrecipes SET first_recipe = '${listOfRecipes[0].second_recipe}', second_recipe = '${listOfRecipes[0].third_recipe}',third_recipe = '${Recipe}' WHERE user_name = '${user_name}'`);
            }
        }
    }
    catch(err){
        throw { status: 400, message: "Couldn't add recipe to recentley seen" };
    }
}

// not sure if we need it
async function getLastView(user_name){
    try{
        const listOfRecipes = await DButils.execQuery(`SELECT * FROM lastseenrecipes WHERE user_name='${user_name}'`);
        if(listOfRecipes.length == 0){
            return null
        }
        else if(listOfRecipes[0].FirstRecipe && listOfRecipes[0].SecondeRecipe == 'null'){
            return listOfRecipes.FirstRecipe
        }
        else if(listOfRecipes[0].SecondRecipe && listOfRecipes[0].ThirdRecipe == 'null'){
            return listOfRecipes.SecondRecipe
        }
        else{
            return listOfRecipes[0].ThirdRecipe
        }
    }
    catch(err){
        throw { status: 400, message: "No recentley viewed recipes yet" };
    }
}

//NEED TO DECIDE ABOUT THE COLUMNS BECAUSE THERE IS A PROBLEM WITH FOREIGN KEYS
async function addRecipeToUser(params){
    try{
        await DButils.execQuery(`INSERT INTO myrecipes (title, readyInMinutes, image, aggregateLikes, is_vegan, is_vegeterian, gluten_free, user_name, ingredients, instructions, number_of_dishes) VALUES ('${params.recipe_name}','${params.duration}', '${params.image}', '${params.popularity}', '${params.vegan!=undefined ? 1:0}', '${params.vegeterian!=undefined? 1:0}',' ${params.glutenFree!=undefined ? 1:0}', "${params.user_name}",' ${params.extendedIngredients}','${params.instructions}',' ${params.servings}')`);
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

exports.getLastView=getLastView;
exports.addLastSeenRecipes=addLastSeenRecipes;
exports.getLastSeenRecipes=getLastSeenRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.addFamilyRecipeToDb = addFamilyRecipeToDb;
exports.getUserRecipes=getUserRecipes;
exports.addRecipeToUser=addRecipeToUser