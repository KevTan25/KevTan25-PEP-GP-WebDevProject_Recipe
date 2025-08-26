/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   // Recipe name, instructions, button
    let addRecipeInput = document.getElementById("add-recipe-name-input");
    let addRecipeTextArea = document.getElementById("add-recipe-instructions-input");
    let addRecipeButton = document.getElementById("add-recipe-submit-input");

    let updateRecipeInput = document.getElementById("update-recipe-name-input");
    let updateRecipeTextArea = document.getElementById("update-recipe-instructions-input");
    let updateRecipeButton = document.getElementById("update-recipe-submit-input");

    let deleteRecipeInput = document.getElementById("delete-recipe-name-input");
    let deleteRecipeButton = document.getElementById("delete-recipe-submit-input");

    // Recipe list container
    let recipeContainer = document.getElementById("recipe-list");

    // Admin Link and logout buttons
    let adminLink = document.getElementById("admin-link");
    let logoutButton = document.getElementById("logout-button");

    // Search input
    let searchInput = document.getElementById("search-input");
    let searchButton = document.getElementById("search-button");


    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token") !== null) {
        logoutButton.style.display = "inline";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    // window.addEventListener("DOMContentLoaded", () => {
    //     getRecipes();
    // });
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let search = searchInput.value;

        try {
            // Returns a JSON
            let response = await fetch(`${BASE_URL}/recipes`); // Not sure if this works

            if (response.status !== 200) {
                alert("Error in fetching recipes!");
                return;
            }

            let data = await response.json();
            recipes = data.filter(r => r.name.toLowerCase().includes(search));

            refreshRecipeList();
            // getRecipes();
            

        } catch (err) {
            console.log(err);
            alert("Unknown error in searching recipes!");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let addName = addRecipeInput.value.trim();
        let addInstructions = addRecipeTextArea.value.trim();

        if (addName === "" || addInstructions === "") {
            alert("Recipe name and instructions are not provided!");
            return;
        }

        const addBody = {
            name: addName,
            instructions: addInstructions
        };

        const token = sessionStorage.getItem("auth-token");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token, // Not sure this is correct
            },
            body: JSON.stringify(addBody)
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if (!response.ok) {
                alert("Response for add failed!");
                return;
            }

            addRecipeInput.value = "";
            addRecipeTextArea.value = "";


            getRecipes(); // This should just add the recipes to array

            // refreshRecipeList(); // Read array and print, don't know if I need because its called in getRecipes

        } catch (err) {
            console.log(err);
            alert("Error occured in addRecipe!");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        let updateName = updateRecipeInput.value.trim();
        let updateInstructions = updateRecipeTextArea.value.trim();

        if (updateName === "" || updateInstructions === "") {
            alert("Recipe name and instructions are not provided!");
            return;
        }

        const recipeToUpdate = recipes.find(rec => rec.name === updateName);

        const updateBody = {
            name: updateName,
            instructions: updateInstructions
        };

        const token = sessionStorage.getItem("auth-token");

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(updateBody)
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, requestOptions); // How to get recipeID

            if (!response.ok) {
                alert("Response for update failed!");
                return;
            }

            updateRecipeInput.value = "";
            updateRecipeTextArea.value = "";

            await getRecipes();
            // refreshRecipeList(); // Not sure if I input recipes here

        } catch (err) {
            console.log(err);
            alert("Error occured in updateRecipe!");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let deleteName = deleteRecipeInput.value.trim();

        if (deleteName === "") {
            alert("Recipe name is not provided!");
            return;
        }

        const recipeToDelete = recipes.find(rec => rec.name === deleteName);

        const deleteBody = {
            name: deleteName,
        };

        const token = sessionStorage.getItem("auth-token");

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token, // Not sure this is correct
            },
            body: JSON.stringify(deleteBody)
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, requestOptions);

            if (!response.ok) {
                alert("Response for delete failed!");
                return;
            }

            deleteRecipeInput.value = "";

            getRecipes();
            // refreshRecipeList(); // Not sure if I input recipes here

        } catch (err) {
            console.log(err);
            alert("Error occured in deleteRecipe!");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            // Returns a JSON
            let response = await fetch(`${BASE_URL}/recipes`);

            if (!response.ok) {
                alert("Error in fetching recipes!");
                return;
            }

            let data = await response.json();
            // if (data.length > 1) {
            //     for (let i = 0; i < data.length; i++) {
            //         recipes[i] = data[0];
            //     }
            // } else {
            //     recipes = data;
            // }
            recipes = data;

            refreshRecipeList();


        } catch (err) {
            console.log(err);
            alert("Error occured in getRecipes!");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeContainer.innerHTML = "";

        recipes.forEach(recipe => {
            let li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeContainer.appendChild(li);
        });
        
        // recipes = [];
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            let token = sessionStorage.getItem("auth-token");

            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            });

            if (!response.ok) {
                alert("Response for logout failed!");
                return;
            }

            sessionStorage.clear();

            setTimeout(() => {
                window.location.href = "../login/login-page.html";
            }, 500)

        } catch (err) {
            console.log(err);
            alert("Error occured in processLogout!");
        }
    }

});
