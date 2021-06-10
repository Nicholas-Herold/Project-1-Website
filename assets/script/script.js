// VARIABLES //
let zip = "";
var searchTermsEl = document.getElementById('userInput'); // Search terms to be included in the search.  Entered in search box by user
var dFreeEl = document.getElementById('dairy'); // This option is selected or not by the user
var eFreeEl = document.getElementById('egg'); // This option is selected or not by the user
var gFreeEl = document.getElementById('gluten'); // This option is selected or not by the user
var wFreeEl = document.getElementById('wheat'); // This option is selected or not by the user
var pFreeEl = document.getElementById('peanut'); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#searchButton"); // This is the Search Button
var recipeTableBody = document.getElementById('recipeList'); 



// THIS WILL RETURN TWO RECIPES "ON SEARCH".  TO CHANGE, EDIT API URL FROM "&to=2" TO &to='desired number of recipes'
// MAY CONSIDER ADDING 'SUGGESTED SEARCH TERMS' SUCH AS "INSTANT POT POTATOES", "INDIAN CHICKEN" OR "BEEF AND ONIONS"
// I ADDED ADDITIONAL HEALTH RESTRICTION OPTIONS
// Finds recipes based on search terms (#userInput) and varied restrictions
function getRecipes() {
    console.log("getRecipes");

    var dfIndicator = "";
    var efIndicator = "";
    var gfIndicator = "";
    var wfIndicator = "";
    var pfIndicator = "";


    // Check for search terms
    if (searchTermsEl.value !== "") {
        console.log(searchTermsEl.value);
        var stIndicator = "q=" + searchTermsEl.value;
    } else { stIndicator = "q=" };

    // Check for dairy-free
    if (dFreeEl.checked == true) {
        console.log("dairy-free is selected");
        dfIndicator = "&health=dairy-free";
    }

    // Check for egg-free
    if (eFreeEl.checked == true) {
        console.log("egg-free is selected");
        efIndicator = "&health=egg-free";
    }

    // Check for gluten-free
    if (gFreeEl.checked == true) {
        console.log("gluten-free is selected");
        gfIndicator = "&health=gluten-free";
    }

    // Check for wheat-free
    if (wFreeEl.checked == true) {
        console.log("wheat-free is selected");
        wfIndicator = "&health=wheat-free";
    }
    // Check for peanut-free
    if (pFreeEl.checked == true) {
        console.log("peanut-free is selected");
        pfIndicator = "&health=peanut-free";
    }

    var apiRecUrl = 'http://api.edamam.com/search?' + stIndicator + dfIndicator + efIndicator + gfIndicator + wfIndicator + pfIndicator + '&app_id=64678b5a&app_key=a6ff725866ecd49b95adf40a798e58fb&from=0&to=8&imageSize=THUMBNAIL';
    console.log(apiRecUrl);
    fetch(apiRecUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (recipedata) {
                    console.log(recipedata);
                    suggestedRecipe(recipedata);
                })
            }
        })
} // end of getRecipes

//Start of suggest
function suggestedRecipe(data) {
    console.log(data.hits[0].recipe.cuisineType.toString());
    var recipeTable = '';
    for(var i=0; i<4;i++){
        var recipe = data.hits[i].recipe;
        var recipeName = recipe.label;
        var mealType = recipe.mealType.toString();
        var recipeImage = recipe.image;
        var cookTime = recipe.totalTime;
        recipeTable += '<tr><td><img src="' +recipeImage + '"/></td><td><h3>' +recipeName +'</h3>Total Cook/Prep Time: '+ cookTime +'min'+'<br>'+mealType + '</td></tr>';
    }
    recipeTableBody.innerHTML = recipeTable;
}

getRecipes();

// Function finds list of restaurants in the area based on lat and lon
function Getrestaurants(lat, lon) {
    fetch('https://api.documenu.com/v2/restaurants/search/geo?key=5162cc5a0a88bba9f4483c32d07d87f7&lat=' + lat + '&lon=' + lon + '&distance=1&fullmenu')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        });
}
// Finds restaurants based on zipcode search
function Ziprestaurants(zipcode) {
    fetch('https://api.documenu.com/v2/restaurants/zip_code/' + zipcode + '?key=5162cc5a0a88bba9f4483c32d07d87f7&size=10')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        });
}

// Assigns geolocation variables calls API function
function success(pos) {
    let latitude = pos.coords.latitude;
    console.log(latitude);
    let longitude = pos.coords.longitude;
    console.log(longitude);
    Getrestaurants(latitude, longitude);
}

// If user doesn't share location show zip search on website
function error() {
    // display zipcode search if location not granted
    zip = '53094';
    Ziprestaurants(zip);
}

// asks for user location when loading site
navigator.geolocation.getCurrentPosition(success, error);


submitButtonEl.addEventListener("click", getRecipes); // Listens for a click of the search button




//NOTE: I ONLY RECEIVED A LIST OF RESTAURANTS WHEN I DECLINED THE GEOLOCATION