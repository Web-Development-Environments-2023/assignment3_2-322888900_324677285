const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id , includeNutrition_value) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: includeNutrition_value,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id, includeNutrition_value) {
    let recipe_info = await getRecipeInformation(recipe_id, includeNutrition_value);
    if (includeNutrition_value == false){
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
        }
    }
    else{
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, instructions, extendedIngredients, servings } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            servings: servings,
            instructions: instructions, 
            extendedIngredients: extendedIngredients ,
        }
    }
}

async function getThreeRecipesByType(typeOfRecipes){
    if (typeOfRecipes == "random"){
        return await axios.get(`${api_domain}/random`, {
            params: {
                number: 3,
                apiKey: process.env.spooncular_apiKey
            }
        });
    }
    else if(typeOfRecipes == 'family'){
        console.log("family")
    }  
    else if(typeOfRecipes == 'favorite'){
        console.log("favorite")
    }     
}

async function getThreeRecipes(typeOfRecipes) {
    let recipe_info = await getThreeRecipesByType(typeOfRecipes);
    return recipe_info.data
}   


exports.getRecipeDetails = getRecipeDetails;
exports.getThreeRecipes  = getThreeRecipes;



