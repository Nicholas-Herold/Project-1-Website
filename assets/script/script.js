// VARIABLES //
let zip = "";
var mainIngredientEl = document.querySelector("#userInput"); // Main ingredient to be included in the search.  Entered in search box by user
var dFreeEl = document.querySelector("#dairy-free"); // This option is selected or not by the user
var gFreeEl = document.querySelector("#gluten-free"); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#search"); // This is the Search Button



//THIS WILL RETURN ONE RECIPE "ON SEARCH" WITH AN INGREDIENT IN THE SEARCH BOX.  STILL WORKING ON DAIRY AND GLUTEN-FREE OPTIONS
// Finds recipes based on 1 main ingredient (#userInput) and no/one/two .restrictions (#dairy-free and #gluten-free)
function getRecipes(){
    console.log("getRecipes");
    if(mainIngredientEl.value !==""){ // If user entered an ingredient
        console.log(mainIngredientEl.value);
        fetch ('http://api.edamam.com/search?q=' + mainIngredientEl.value + '&app_id=64678b5a&app_key=a6ff725866ecd49b95adf40a798e58fb&from=0&to=2&imageSize=THUMBNAIL')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (recipedata) {
                console.log(recipedata);
                })
            }
        })

    } else {
        console.log("no ingredient");
    }
}

    


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