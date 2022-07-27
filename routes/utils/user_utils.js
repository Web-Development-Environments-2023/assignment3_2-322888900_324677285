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

async function getLastThreeRecipes(user_name, Recipe){
    try{
        const listOfRecipes = await DButils.execQuery(`select * from lastthree where user_name='${user_name}'`);
        if(!listOfRecipes){
            await DButils.execQuery(`insert into lastthree values ('${user_name}', '${Recipe}','${null}','${null}'`);
            return {"user_name":user_name, "FirstRecipe":Recipe}
        }
        else if(listOfRecipes.FirstRecipe&& !listOfRecipes.SecondeRecipe){
            await DButils.execQuery(`insert into lastthree values ('${user_name}', '${listOfRecipes.FirstRecipe}','${Recipe}','${null}'`);
            return {"user_name":user_name, "FirstRecipe":listOfRecipes.FirstRecipe,"SecondRecipe":Recipe}
        }
        else if(listOfRecipes.SecondRecipe&& !listOfRecipes.ThirdRecipe){
            await DButils.execQuery(`insert into lastthree values ('${user_name}', '${listOfRecipes.FirstRecipe}','${listOfRecipes.SecondRecipe}','${Recipe}'`);
            return {"user_name":user_name, "FirstRecipe":listOfRecipes.FirstRecipe,"SecondRecipe":listOfRecipes.SecondRecipe,"ThirdRecipe":Recipe}
        }
        else{
            await DButils.execQuery(`insert into lastthree values ('${user_name}', '${listOfRecipes.SecondRecipe}','${listOfRecipes.ThirdRecipe}','${Recipe}'`);
            return {"user_name":user_name, "FirstRecipe":listOfRecipes.SecondRecipe,"SecondRecipe":listOfRecipes.ThirdRecipe,"ThirdRecipe":Recipe}
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
        const listOfRecipes = await DButils.execQuery(`select * from lastthree where user_name='${user_name}'`);
        if(!listOfRecipes){
            return null
        }
        else if(listOfRecipes.FirstRecipe&& !listOfRecipes.SecondeRecipe){
            return listOfRecipes.FirstRecipe
        }
        else if(listOfRecipes.SecondRecipe&& !listOfRecipes.ThirdRecipe){
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
exports.getLastThreeRecipes=getLastThreeRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.addFamilyRecipeToDb = addFamilyRecipeToDb;
//NIV DONE
//exports.getUserRecipes=getUserRecipes;
//exports.addRecipeToUser=addRecipeToUser