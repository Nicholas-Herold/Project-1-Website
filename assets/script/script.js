// VARIABLES //
let zip = "";
var searchTermsEl = document.getElementById('userInput'); // Search terms to be included in the search.  Entered in search box by user
var dFreeEl = document.getElementById('dairy'); // This option is selected or not by the user
var eFreeEl = document.getElementById('egg'); // This option is selected or not by the user
var gFreeEl = document.getElementById('gluten'); // This option is selected or not by the user
var wFreeEl = document.getElementById('wheat'); // This option is selected or not by the user
var pFreeEl = document.getElementById('peanut'); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#searchButton"); // This is the Search Button
var submitButtonE2 = document.getElementById('restbtn');
var ziptxt = document.getElementById('ziptxt');
var zipinput = document.getElementById('zipinput');
var recipeTableBody = document.getElementById('recipeList'); 
// var moreRecBtns = document.querySelectorAll('.moreRecipesBtn');
var seeMoreRecBtn = document.getElementById('moreRec');
var videoContainer = $('#videoContainer');
var recipesFromAPI;


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
                    // console.log(recipedata);
                    // if(seeMoreRecBtn.clicked == true || submitButtonEl.clicked == true){
                    //     createSeeMoreOrSearchRecipe(recipedata);
                        seeMoreRecBtn.addEventListener('click', () =>
                    createSeeMoreOrSearchRecipe(recipedata));
                    submitButtonEl.addEventListener('click', () =>
                    createSeeMoreOrSearchRecipe(recipedata));
            
                      suggestedRecipe(recipedata);  
                    
                    
                })
            }
        })
} // end of getRecipes

//Start of suggest
function suggestedRecipe(data) {
    // console.log(data.hits[0].recipe.cuisineType.toString());
    var recipeTable = '';
    
    for(var i=0; i<4;i++){
        var item = data.hits[i];
        var recipeName = item.recipe.label;
        var recipeImage = item.recipe.image;
        var cookYield = item.recipe.yield;
        recipeTable += '<tr><td><img src="' +recipeImage + '"/></td><td><h3>' +recipeName +'</h3>Number of Servings: '+ cookYield +'</td></tr>';
    }
    recipeTableBody.innerHTML = recipeTable;
}

function createSeeMoreOrSearchRecipe(data){
    $('#videoContainer').css('display', 'none');
    var recipeTable = '';
    console.log(data);
    for(var i=0; i<8;i++){
        var item = data.hits[i];
        var recipeName = item.recipe.label;
        var recipeImage = item.recipe.image;
        var cookYield = item.recipe.yield;
        recipeTable += '<tr><td><img src="' +recipeImage + '"/></td><td><h3>' +recipeName +'</h3>Number of Servings: '+ cookYield +'</td></tr>';
    }
    recipeTableBody.innerHTML = recipeTable;
}


getRecipes();
// console.log('api ' +recipesFromAPI);

// Function finds list of restaurants in the area based on lat and lon
function Getrestaurants(lat, lon) {

    fetch('https://api.documenu.com/v2/restaurants/search/geo?key=5162cc5a0a88bba9f4483c32d07d87f7&lat='+ lat +'&lon='+lon+'&distance=1&fullmenu')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        console.log(data);
        ////
        popRestList(data);
    });
}
// Finds restaurants based on zipcode search
function Ziprestaurants(zipcode) {
    
    fetch('https://api.documenu.com/v2/restaurants/zip_code/'+zipcode+'?key=5162cc5a0a88bba9f4483c32d07d87f7&size=5')
    .then(response => {
      return response.json();
    })
    .then (data =>{
        console.log(data);
        popRestList(data);
    });

}

// Assigns geolocation variables calls API function
function success(pos) {
    
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude;
    
    Getrestaurants(latitude, longitude);
   
}

// If user doesn't share location show zip search on website
function error() {
    ziptxt.style.display='block';
    zipinput.style.display='block';
    restbtn.style.display='block';
    document.getElementById("autolocat").style.display="none";
    zip = '53094'
    Ziprestaurants(zip)

   
}

// This function uses the Restaurant API to create a list <divs> of 5 local restaurants
function popRestList(data){
    console.log(data);

    var datarray = data.data; // Data is returned as an object.  This pulls out the data array from the object called data.
    // if(datarray.length == 0){
    //     let warning = document.createElement('div');
    //     warning.innerHTML='No results. Please try another area code'
    //     document.getElementById('restsection').appendChild(warning)
    //     return
    // }
    // divsectionEL is the variable that represents the location in the HTML where the new div is created.  It is identified by #restsection
    // divEl is the variable associated with the new div element.  It contains the restaurant name
    // divElp is the variable associated with the p element containing the phone number that is attached to the div
    // divEls is the variable associated with p element containing the street address that is attached to the div
    // divElc is the variable associated with p element containing the city, state, zip info that is attached to the div

    datarray.forEach(index => {
   
        console.log(datarray);
        var divEl = document.createElement("div");
        divEl.classList = "rName";
        divEl.innerHTML = index.restaurant_name;
        var divsectionEl = document.querySelector("#restsection");

        var divElp = document.createElement("p");
        divElp.classList = "rPhone nobottommargin";
        divElp.innerHTML = index.restaurant_phone;

        var divEls = document.createElement("p");
        divEls.classList = "rStreet nobottommargin";
        divEls.innerHTML = index.address.street;

        var divElc = document.createElement("p");
        divElc.classList = "rCity";
        divElc.innerHTML = index.address.city + ", " + index.address.state + ", " + index.address.postal_code;

        divEl.appendChild(divElp);
        divEl.appendChild(divEls);
        divEl.appendChild(divElc)
        divsectionEl.appendChild(divEl);
    })
} // end of popRestList ()















// asks for user location when loading site
navigator.geolocation.getCurrentPosition(success, error);


submitButtonEl.addEventListener("click", getRecipes); // Listens for a click of the search button




