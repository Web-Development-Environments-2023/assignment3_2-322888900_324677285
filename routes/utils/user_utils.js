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


//NIV DONE
//RETURNS ALL RECIPES OF SPECIFIC USER BY USERNAME
// async function getUserRecipes(user_name){
//     try{
//        const recipes_id= await DButils.execQuery(`select recipe_id from users where user_name='${user_name}'`);
//        return recipes_id; 
//     }
//     catch(err){
//        throw { status: 401, message: err };
//     }
    
// }


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

//NIV DONE
//insert recipe to user
// async function addRecipeToUser(user_name, recipe_id){
//     try{
//         await DButils.execQuery(`insert into myrecipes values ('${user_name}', '${recipe_id}', '${owner}', '${when_to_cook}', '${ingredients}', '${instructions}',' ${photos}')`);
//     }
//     catch(err){
//         throw { status: 401, message: err };
//     }
// }



async function addFamilyRecipeToDb(user_name, recipe_id, owner, when_to_cook, ingredients, instructions, photos){
    try{
        await DButils.execQuery(`insert into familyrecipes values ('${user_name}', '${recipe_id}', '${owner}', '${when_to_cook}', '${ingredients}', '${instructions}',' ${photos}')`);
    }
    catch(err){
        throw { status: 401, message: err };
    }
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipesFromDb = getFamilyRecipesFromDb;
exports.addFamilyRecipeToDb = addFamilyRecipeToDb;
//NIV DONE
//exports.getUserRecipes=getUserRecipes;
//exports.addRecipeToUser=addRecipeToUser