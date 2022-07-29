const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils")

// favorite recipes
async function markAsFavorite(user_name, recipe_id){
    try{
        await DButils.execQuery(`insert into favorites values (${recipe_id}, '${user_name}')`);
    }
    catch(err){
       throw { status: 401, message: err };
    }
    
}




async function getFavoriteRecipes(user_name){
    try{
        const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

// family recipes
async function getFamilyRecipesFromDb(user_name){
    try{

        const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM familyrecipes WHERE user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

async function getLastSeenRecipes(user_name){
    try{
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
        console.log(`the recipes are: ${listOfRecipes}`)
        console.log(listOfRecipes)
        console.log(`the recipe to add ${Recipe}`)
        if(listOfRecipes.length == 0){
            console.log("empty array")
            await DButils.execQuery(`INSERT INTO lastseenrecipes VALUES ('${user_name}', '${Recipe}','${null}','${null}')`);
        }
        else if(listOfRecipes[0].first_recipe && listOfRecipes[0].second_recipe === null){
            console.log("has one recipe")
            await DButils.execQuery(`UPDATE lastseenrecipes SET first_recipe = '${listOfRecipes[0].first_recipe}','${Recipe}','${null}' WHERE user_name = '${user_name}`);
        }
        else if(listOfRecipes[0].second_recipe && listOfRecipes[0].third_recipe === null){
            console.log("has two recipes")
            await DButils.execQuery(`UPDATE lastseenrecipes SET first_recipe = '${listOfRecipes[0].first_recipe}', second_recipe = '${listOfRecipes[0].second_recipe}','${Recipe}' WHERE user_name = '${user_name}`);
        }
        else{
            console.log("has three recipes")
            await DButils.execQuery(`UPDATE lastseenrecipes SET second_recipe =  '${listOfRecipes[0].second_recipe}', third_recipe = '${listOfRecipes[0].third_recipe}','${Recipe}' WHERE user_name = '${user_name}'`);
        }
    }
    catch(err){
        throw { status: 400, message: "Couldn't add recipe to recentley seen" };
    }
}


async function addFamilyRecipeToDb(user_name, recipe_id, owner, when_to_cook, ingredients, instructions, photos){
    try{
        await DButils.execQuery(`insert into familyrecipes values ('${user_name}', '${recipe_id}', '${owner}', '${when_to_cook}', '${ingredients}', '${instructions}',' ${photos}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}


async function getLastView(user_name){
    try{
        const listOfRecipes = await DButils.execQuery(`select * from lastseenrecipes where user_name='${user_name}'`);
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


exports.getLastView=getLastView;
exports.addLastSeenRecipes=addLastSeenRecipes;
exports.getLastSeenRecipes=getLastSeenRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.addFamilyRecipeToDb = addFamilyRecipeToDb;
//NIV DONE
//exports.getUserRecipes=getUserRecipes;
//exports.addRecipeToUser=addRecipeToUser