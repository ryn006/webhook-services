const axios = require('axios');

async function searchRecipes(query, options) {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                query: query,
                ...options,
                apiKey: '6b283e2478894e3b876d0617f07f970e'
            }
        });

        return response.data.results;
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular API:', error);
        throw error;
    }
}

// Example usage:
async function handleWebhookRequest(req, res) {
    const query = req.body.queryResult.queryText; // Extract query from Dialogflow request
    const options = {
        number: 3, // Number of results
        addRecipeInformation: true // Include recipe information
        // Add any other options you want to include
    };

    try {
        const recipes = await searchRecipes(query, options);

        // Process recipes and construct response to send back to Dialogflow
        const response = constructResponse(recipes);

        res.json({
            fulfillmentText: response
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}

// Function to process recipes and construct response
function constructResponse(recipes) {
    let responseText = 'Here are some recipe suggestions:\n\n';

    recipes.forEach(recipe => {
        responseText += `${recipe.title}\n${recipe.image}\n\n`;
    });

    return responseText;
}

// Example Express route for handling webhook requests
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', handleWebhookRequest);

app.listen(PORT, () => {
    console.log(`Webhook server is listening on port ${PORT}`);
});