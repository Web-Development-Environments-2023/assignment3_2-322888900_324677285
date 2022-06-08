const DButils = require("./DButils");

async function markAsFavorite(user_name, recipe_id){
    await DButils.execQuery(`insert into favorites values ('${user_name}',${recipe_id})`);
}

async function getFavoriteRecipes(user_name){
    const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_name='${user_name}'`);
    return recipes_id;
}

async function getFamilyRecipes(user_name){
    const recipes_id = await DButils.execQuery(`select recipe_id from familyrecipes where user_name='${user_name}'`);
    return recipes_id;
}




exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
