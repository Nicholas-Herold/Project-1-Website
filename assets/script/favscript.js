// VARIABLES //
var homeButtonEl = document.querySelector("#homeButton");

// (The api keys could be put in a glogal .js file.  They are also located in script.js)
//Input personal api info for sites
var apiIDEdamam = '64678b5a';
//'e60d435c';
var apiKeyEdamam = 'a6ff725866ecd49b95adf40a798e58fb';
//'18c34531a5ee1f4b51fad57248de2882';
var apiKeyDocuMenu = '482dba2d80d289f9b05593b779efcd47';
//orig key and id for Edamam '&app_id=64678b5a&app_key=a6ff725866ecd49b95adf40a798e58fb'
//orig key for documenu key=5162cc5a0a88bba9f4483c32d07d87f7


// FUNCTIONS //

// Returns to homepage
function homePage(){
    window.open("./index.html", target="_self");
}

// Create suggested recipe list
function favoriteRecipe(data, numberOfListItems) {

    var recipeTable = '';

    for (var i = 0; i < numberOfListItems; i++) {
        var item = data.hits[i];
        var recipeName = item.recipe.label;
        var recipeImage = item.recipe.image;
        var cookYield = item.recipe.yield;
        uriModal = item.recipe.uri.toString();

        if(item.recipe.url != null && item.recipe.url != 'undefined'){
        link = item.recipe.url.toString();
        }
        if(item.recipe.cuisineType != null && item.recipe.cuisineType != 'undefined'){
        cuisine = item.recipe.cuisineType.toString();
        }
        if(item.recipe.mealType != null && item.recipe.mealType != 'undefined'){
        type = item.recipe.mealType.toString();
        }
        if(item.recipe.dietLabels != null && item.recipe.dietLabels != 'undefined'){
        diet = item.recipe.dietLabels.toString();
        }
        let ingredients = item.recipe.ingredients;
        let ingredientslist = '<div style="font-size:25px"> Ingredents Required';
        ingredientslist += '<ul style="padding-left:30px">';
        ingredients.forEach(element => {
            ingredientslist+= '<li style="font-size:20px" >' + element.text + '</li>'
             });
        ingredientslist+= '</ul>';
        ingredientslist+= '</div>';
        searchModal = '<p><button class="button" data-open="modal' + i + '">' + recipeName + '</button></p><div class="small reveal" id="modal' + i + '" data-reveal><div class="recipemodal"><h1 class="recipe-title">' + recipeName + '</h1><img class="modal-image" src="' + recipeImage + '" alt=""><p>Meal type: ' + type.toUpperCase() + '</p><p>Cuisine type: ' + cuisine.toUpperCase() + '</p><p>Diet: ' + diet.toUpperCase() + '</p>'+ingredientslist+'<a class="modal-link" href="' + link + '">Link to recipe</a><button type="button" name="'+recipeName+'" class="button favbtn" onclick= "addfav(value,name)" value="' + uriModal + '">Add to Favorites &#9733</button></div><button class="close-button" data-close aria-label="Close reveal" type="button"><span aria-hidden="true">&times;</span></button></div>';
        
        recipeTable += '<tr><td><img src="' +recipeImage + '"/></td><td><h3>' + searchModal +'</h3>Number of Servings: '+ cookYield +'</td></tr>';
    }
    // recipeTableBody.innerHTML = recipeTable;
    renderTable(recipeTable);



    function addfav(id,name){
        let recipeid = id.split('_').pop();
            console.log(name)
            console.log(recipeid)
        
        let names=name;
        var recipeobj = {
            recname: names,
            recid: recipeid,
        }
            
        let favcheck = recipefavorites.findIndex(({recid})=>recid === recipeid)
            console.log(favcheck)

        if(favcheck === -1){
        recipefavorites.unshift (recipeobj)
        recipefavorites.splice(10);

            console.log (recipeobj)
            console.log(recipefavorites)

        localStorage.setItem("favs",JSON.stringify(recipefavorites));}
    }}


// Creates favorite buttons from Local Storage
var getfavorites = function () {
    recipefavorites = JSON.parse(localStorage.getItem("favs"));

    var favoritebuttons = document.querySelector("#favoriteslist"); // where the ul is in the html
    var favoritebuttonsUl = document.createElement("button")
    favoritebuttonsUl.className = "list-group listOfFavoriteButtons";
    favoritebuttons.appendChild(favoritebuttonsUl);

    if (!recipefavorites){
            recipefavorites = [];
            return false
        }

    for(i = 0; i < recipefavorites.length; i++) {
        var favrecipe = document.createElement("button");
        favrecipe.setAttribute("type", "button");
        favrecipe.className = "button favbutton1";
        favrecipe.setAttribute("value", recipefavorites[i].recid);
        favrecipe.textContent = recipefavorites[i].recname;
        favoritebuttonsUl.appendChild(favrecipe);
    }
    
    var recentlySavedRecipe = document.querySelector(".listOfFavoriteButtons");
    recentlySavedRecipe.addEventListener('click', useStored);
}

// Captures recipe id and transfers to goToFavRecipe
var useStored = function (event) {
    recipeid = event.target.getAttribute("value");
    goToFavRecipe(recipeid);
}


// Opens recipe in new tab
var goToFavRecipe = function (recipeid){
    var apiFavUrl ="https://api.edamam.com/api/recipes/v2/" + recipeid + "?app_id=" + apiIDEdamam + "&app_key=" + apiKeyEdamam + "&type=public";
    fetch(apiFavUrl)
        .then(function(response){
            if (response.ok){
                response.json().then(function (data) {
                window.open(data.recipe.url, target="_blank");
                })
            }
        })
    

}


// EXECUTION //

// Load Favorite Buttons
getfavorites();

// Listen for click to return to home page
homeButtonEl.addEventListener("click", homePage);
