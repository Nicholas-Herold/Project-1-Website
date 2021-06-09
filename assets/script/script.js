// VARIABLES //
let zip = "";
var searchTermsEl = document.querySelector("#userInput"); // Search terms to be included in the search.  Entered in search box by user
var dFreeEl = document.querySelector("#dairy-free"); // This option is selected or not by the user
var eFreeEl = document.querySelector("#egg-free"); // This option is selected or not by the user
var gFreeEl = document.querySelector("#gluten-free"); // This option is selected or not by the user
var wFreeEl = document.querySelector("#wheat-free"); // This option is selected or not by the user
var pFreeEl = document.querySelector("#peanut-free"); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#search"); // This is the Search Button




// THIS WILL RETURN TWO RECIPES "ON SEARCH".  TO CHANGE, EDIT API URL FROM "&to=2" TO &to='desired number of recipes'
// MAY CONSIDER ADDING 'SUGGESTED SEARCH TERMS' SUCH AS "INSTANT POT POTATOES", "INDIAN CHICKEN" OR "BEEF AND ONIONS"
// I ADDED ADDITIONAL HEALTH RESTRICTION OPTIONS
// Finds recipes based on search terms (#userInput) and varied restrictions
function getRecipes(){
    console.log("getRecipes");

    var dfIndicator = "";
    var efIndicator = "";
    var gfIndicator = "";
    var wfIndicator = "";
    var pfIndicator = "";


    // Check for search terms
    if(searchTermsEl.value !=="") {
        console.log(searchTermsEl.value);
        var stIndicator = "q=" + searchTermsEl.value;
    } else { stIndicator = "q="};

    // Check for dairy-free
    if(dFreeEl.selected){
        console.log("dairy-free is selected");
        dfIndicator = "&health=dairy-free";
    }

    // Check for egg-free
    if(eFreeEl.selected){
        console.log("egg-free is selected");
        efIndicator = "&health=egg-free";
    }

    // Check for gluten-free
    if(gFreeEl.selected){
        console.log("gluten-free is selected");
        gfIndicator = "&health=gluten-free";
    }

    // Check for wheat-free
    if(wFreeEl.selected){
        console.log("wheat-free is selected");
        wfIndicator = "&health=wheat-free";
    }
    // Check for peanut-free
    if(pFreeEl.selected){
        console.log("peanut-free is selected");
        pfIndicator = "&health=peanut-free";
    }

    var apiRecUrl = 'http://api.edamam.com/search?' + stIndicator + dfIndicator + efIndicator + gfIndicator + wfIndicator + pfIndicator +'&app_id=64678b5a&app_key=a6ff725866ecd49b95adf40a798e58fb&from=0&to=2&imageSize=THUMBNAIL';
    fetch (apiRecUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function(recipedata) {
            console.log(recipedata);
            })
        }
    })
} // end of getRecipes

    


// Function finds list of restaurants in the area based on lat and lon
function Getrestaurants(lat, lon) {
    fetch('https://api.documenu.com/v2/restaurants/search/geo?key=5162cc5a0a88bba9f4483c32d07d87f7&lat='+ lat +'&lon='+lon+'&distance=1&fullmenu')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        console.log(data);
    });
}
// Finds restaurants based on zipcode search
function Ziprestaurants(zipcode) {
    fetch('https://api.documenu.com/v2/restaurants/zip_code/'+zipcode+'?key=5162cc5a0a88bba9f4483c32d07d87f7&size=10')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        console.log(data);
    });
}

// Assigns geolocation variables calls API function
function success(pos) {
    let latitude = pos.coords.latitude;
    console.log(latitude);
    let longitude = pos.coords.longitude;
    console.log(longitude);
    Getrestaurants(latitude,longitude);
}

// If user doesn't share location show zip search on website
function error(){
    // display zipcode search if location not granted
    zip = '53094';
    Ziprestaurants(zip);
}

// asks for user location when loading site
navigator.geolocation.getCurrentPosition(success, error);


submitButtonEl.addEventListener("click", getRecipes); // Listens for a click of the search button




//NOTE: I ONLY RECEIVED A LIST OF RESTAURANTS WHEN I DECLINED THE GEOLOCATION