const DButils = require("./DButils");


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

        const recipes_id = await DButils.execQuery(`select recipe_id from familyrecipes where user_name='${user_name}'`);
        return recipes_id;
    }
    catch(err){
        throw { status: 401, message: err };
    }

}

async function getLastSeenRecipes(user_name){
    try{
        const listOfRecipes = await DButils.execQuery(`select * from lastseenrecipes where user_name='${user_name}'`);
        let response_body = {}
        response_body.user_name = user_name
        if(!listOfRecipes){
            if(listOfRecipes.FirstRecipe){
                response_body.FirstRecipe = listOfRecipes.FirstRecipe 
            }
            if(listOfRecipes.SecondRecipe){
                response_body.SecondRecipe = listOfRecipes.SecondRecipe
            }
            if(listOfRecipes.ThirdRecipe){
                response_body.ThirdRecipe = listOfRecipes.ThirdRecipe
            }
            return response_body
        }
        return response_body
    }
    catch(err){
        throw { status: 401, message: err };
    }
}


async function addLastSeenRecipes(user_name, Recipe){
    try{
        const listOfRecipes = await DButils.execQuery(`select * from lastseenrecipes where user_name='${user_name}'`);
        if(!listOfRecipes){
            await DButils.execQuery(`insert into lastseenrecipes values ('${user_name}', '${Recipe}','${null}','${null}'`);
        }
        else if(listOfRecipes.FirstRecipe&& !listOfRecipes.SecondeRecipe){
            await DButils.execQuery(`insert into lastseenrecipes values ('${user_name}', '${listOfRecipes.FirstRecipe}','${Recipe}','${null}'`);
        }
        else if(listOfRecipes.SecondRecipe&& !listOfRecipes.ThirdRecipe){
            await DButils.execQuery(`insert into lastseenrecipes values ('${user_name}', '${listOfRecipes.FirstRecipe}','${listOfRecipes.SecondRecipe}','${Recipe}'`);
        }
        else{
            await DButils.execQuery(`insert into lastseenrecipes values ('${user_name}', '${listOfRecipes.SecondRecipe}','${listOfRecipes.ThirdRecipe}','${Recipe}'`);
        }
    }
    catch(err){
        throw { status: 401, message: err };
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
        if(!listOfRecipes){
            return null
        }
        else if(listOfRecipes.FirstRecipe && !listOfRecipes.SecondeRecipe){
            return listOfRecipes.FirstRecipe
        }
        else if(listOfRecipes.SecondRecipe && !listOfRecipes.ThirdRecipe){
            return listOfRecipes.SecondRecipe
        }
        else{
            return listOfRecipes.ThirdRecipe
        }
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
//NIV DONE
//exports.getUserRecipes=getUserRecipes;
//exports.addRecipeToUser=addRecipeToUser