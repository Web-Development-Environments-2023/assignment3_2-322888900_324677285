const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function recipeInfoFromApi(recipe_id , includeNutrition_value ) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: includeNutrition_value,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id, includeNutrition_value, search_result) {
    let recipe_info = await recipeInfoFromApi(recipe_id, includeNutrition_value);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, instructions, extendedIngredients, servings } = recipe_info.data;
    let json_data = {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }

    if (includeNutrition_value == false && search_result == false){
        return json_data
    }
    else if(includeNutrition_value == true && search_result == false){
        json_data.servings = servings
        json_data.instructions = instructions
        json_data.extendedIngredients = extendedIngredients
        return json_data
    }
    else if(includeNutrition_value == false && search_result == true){
        json_data.instructions = instructions
        return json_data
    }
}

// random recipes
async function randomRecipesFromApi(){
    return await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRandomRecipes() {
    let recipe_info = await randomRecipesFromApi();
    return recipe_info.data
}   


// search results
async function searchResultsFromApi(query_str, num_of_results, cuisine, diet, intolerances){
    //, num_of_results, cuisine, diet, intolerances
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: query_str,
            number: num_of_results,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function searchForRecipe(query, numberOfResults, cuisine, diet, intolerances){
    if(numberOfResults === undefined){
        numberOfResults = 5
    }
    let search_results = await searchResultsFromApi(query, numberOfResults, cuisine, diet, intolerances);
    const data = search_results.data["results"]
    let results = []
    for (let i = 0; i< data.length; i++){
        results.push(await getRecipeDetails(data[i]["id"], false, true))
    }    
    return results
}


exports.searchForRecipe = searchForRecipe;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes  = getRandomRecipes;