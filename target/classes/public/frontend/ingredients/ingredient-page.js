/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let addIngredientButton = document.getElementById("add-ingredient-submit-button");

let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
let deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

let ingredientListContainer = document.getElementById("ingredient-list");

// searchInput

// No adminLink in html
// if (sessionStorage.getItem("is-admin") === "true") {
//     adminLink.style.display = "inline";
// }

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.addEventListener("click", addIngredient);
deleteIngredientButton.addEventListener("click", deleteIngredient);


/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("DOMContentLoaded", () => {
    getIngredients();
});


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let addName = addIngredientNameInput.value.trim();
    const token = sessionStorage.getItem("auth-token");

    if (addName === "") {
        alert("Ingredient name is not provided!");
        return;
    }

    const addBody = {
        name: addName,
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(addBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (!response.ok) {
            alert("Response for add failed!");
            return;
        }

        await getIngredients(); // Should call refreshIngredientList() in it

    } catch (err) {
        console.log(err);
        alert("Error in addIngredient!");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const token = sessionStorage.getItem("auth-token");
    try {
        let response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });

        if (!response.ok) {
            alert("Error in fetching recipes!");
            return;
        }

        let data = await response.json();
        ingredients = data;

        refreshIngredientList();

    } catch (err) {
        console.log(err);
        alert("Error in getIngredients!");
    }
    
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let deleteName = deleteIngredientNameInput.value.trim();

    if (deleteName === "") {
        alert("Ingredient name is not provided!");
        return;
    }

    let ingredient = ingredients.find(ing =>
        ing.name.toLowerCase() === deleteName.toLowerCase()
    );

    if (!ingredient) {
        alert("Ingredient not found!");
        return;
    }

    const token = sessionStorage.getItem("auth-token");

    const requestOptions = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token,
        },
    };

    try {
        let response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, requestOptions);

        if (!response.ok) {
            alert("Failed to delete ingredient!");
            return;
        }

        deleteIngredientNameInput.value = "";

        await getIngredients(); // Do I need await?

    } catch (err) {
        console.log(err);
        alert("Error in deleteIngredient!");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        let li = document.createElement("li");
        // let p = document.createElement("p");
        li.textContent = `${ingredient.name}`;

        // li.appendChild(p); // Append the p element inside the li element
        ingredientListContainer.appendChild(li);
    });
}

