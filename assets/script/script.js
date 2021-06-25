// VARIABLES //
let zip = "";
var searchTermsEl = document.getElementById('userInput'); // Search terms to be included in the search.  Entered in search box by user
var dFreeEl = document.getElementById('dairy'); // This option is selected or not by the user
var eFreeEl = document.getElementById('egg'); // This option is selected or not by the user
var gFreeEl = document.getElementById('gluten'); // This option is selected or not by the user
var wFreeEl = document.getElementById('wheat'); // This option is selected or not by the user
var pFreeEl = document.getElementById('peanut'); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#searchButton"); // This is the Search Button
var favoriteButtonEl = document.querySelector("#favoriteButton");
var submitButtonE2 = document.getElementById('zipbtn');

var ziptxt = document.getElementById('ziptxt');
var zipinput = document.getElementById('zipinput');
var ziperror = "";
var recipefavorites = JSON.parse(localStorage.getItem('favs'))||[];
var recipeTableBody = document.getElementById('recipeList');
var seeMoreRecBtn = document.getElementById('moreRec');
var recListHeader = document.getElementById('recipeListHeader');
var videoContainer = $('#videoContainer');
var displayMoreRecipes = 10;
var displayRestaurants = 5;

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

    var apiRecUrl = 'https://api.edamam.com/search?' + stIndicator + dfIndicator + efIndicator + gfIndicator + wfIndicator + pfIndicator + '&app_id=' + apiIDEdamam+ '&app_key=' + apiKeyEdamam + '&from=0&to=30&imageSize=THUMBNAIL';
    console.log(apiRecUrl);
    fetch(apiRecUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (recipedata) {
                    console.log(recipedata);
                    seeMoreRecBtn.addEventListener('click', () =>
                        createSeeMoreRecipeList(recipedata));
                    submitButtonEl.addEventListener('click', function () {
                        createSearchRecipe(recipedata)
                    });

                    suggestedRecipe(recipedata, 5);
                })
            }
        })
} // end of getRecipes

//Create suggested recipe list
function suggestedRecipe(data, numberOfListItems) {

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
}

//Add more items to recipe list
function createSeeMoreRecipeList(data) {
    $('#videoContainer').css('display', 'none');

    if (displayMoreRecipes >= 30) {
        seeMoreRecBtn.style.display = 'none';
    }
    suggestedRecipe(data, displayMoreRecipes);
    displayMoreRecipes += 10;
}

//Create search list for top results based on user criteria
function createSearchRecipe(data) {
    recListHeader.textContent = 'Top Results'
    displayMoreRecipes = 10;
    displayRestaurants = 5;

    suggestedRecipe(data, displayMoreRecipes);
    seeMoreRecBtn.addEventListener('click', () =>
        createSeeMoreRecipeList(data));
}

// Function finds list of restaurants in the area based on lat and lon
function Getrestaurants(lat, lon) {

    fetch('https://api.documenu.com/v2/restaurants/search/geo?key='+ apiKeyDocuMenu +'&lat='+ lat +'&lon='+lon+'&distance=1&fullmenu')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        popRestList(data);
    });
}

// Finds restaurants based on zipcode search
function Ziprestaurants() {
    document.querySelector("#restsection").innerHTML = ""

    let zipcode = zipinput.value
    console.log(zipcode)
    fetch('https://api.documenu.com/v2/restaurants/zip_code/' + zipcode + '?key='+apiKeyDocuMenu+'&size=10')
        .then(response => {
            return response.json();
        })
        .then(data => {
            popRestList(data);
        });

}

// Assigns geolocation variables calls API function
function success(pos) {
    console.log("pos_success")
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude;
    Getrestaurants(latitude, longitude);

}

// If user doesn't share location show zip search on website
function error() {
    console.log("error");
    ziptxt.style.display='block';
    zipinput.style.display='block';
    zipbtn.style.display='block';
    document.getElementById("autolocat").style.display="none";
}

// This function uses the Restaurant API to create a list <divs> of 5 local restaurants
function popRestList(data) {
    // console.log(data);
    var divsectionEl = document.querySelector("#restsection");
    var datarray = data.data; // Data is returned as an object.  This pulls out the data array from the object called data.

    // divsectionEL is the variable that represents the location in the HTML where the new div is created.  It is identified by #restsection
    // divEl is the variable associated with the new div element.  It contains the restaurant name
    // divElp is the variable associated with the p element containing the phone number that is attached to the div
    // divEls is the variable associated with p element containing the street address that is attached to the div
    // divElc is the variable associated with p element containing the city, state, zip info that is attached to the div
    //divEla is the variable associated with p element containing restaurant website
    if (datarray.length == 0){
        divsectionEl.classList.remove("hide");
        divsectionEl.innerHTML="No Results for this area";
        error();
        return
    }

    divsectionEl.innerHTML = '';
    for (var i = 0; i < displayRestaurants; i++) {
        console.log(datarray);
        var divEl = document.createElement("div");
        divEl.classList = "rName";
        divEl.innerHTML = datarray[i].restaurant_name;
        divsectionEl.classList.remove("hide");

        var divElp = document.createElement("p");
        divElp.classList = "rPhone nobottommargin";
        divElp.innerHTML = datarray[i].restaurant_phone;

        var divEls = document.createElement("p");
        divEls.classList = "rStreet nobottommargin";
        divEls.innerHTML = datarray[i].address.street;

        var divElc = document.createElement("p");
        divElc.classList = "rCity nobottommargin";
        divElc.innerHTML = datarray[i].address.city + ", " + datarray[i].address.state + ", " + datarray[i].address.postal_code;

        var divEla = document.createElement('p');
        divEla.textContent = 'No Website Available';
        if( datarray[i].restaurant_website != " " && datarray[i].restaurant_website != ""){
            divEla.innerHTML = "<a href='" + datarray[i].restaurant_website + "' target = '_blank'>Go to Website</a>";
        }

        divEl.appendChild(divElp);
        divEl.appendChild(divEls);
        divEl.appendChild(divElc);
        divEl.appendChild(divEla);
        divsectionEl.appendChild(divEl);
    }
    // if (displayRestaurants < datarray.length) {
    //     createSeeMoreBtn(data, divsectionEl);
    //     }
    
} // end of popRestList ()

// Function for reinitializing foundation
function renderTable(modal) {
    $('#recipeList').html(modal);
    $(document).foundation();
}

// Store favorites to local storage
function addfav(id,name){
    let recipeid = id.split('_').pop();
    let names = name;

    var recipeobj = {
        recname: names,
        recid: recipeid,
    }
        
    let favcheck = recipefavorites.findIndex(({recid})=>recid === recipeid)
        console.log(favcheck)
    
    if(favcheck === -1){
        recipefavorites.unshift (recipeobj)
        recipefavorites.splice(5);
        localStorage.setItem("favs",JSON.stringify(recipefavorites));}
}

// Opens new page which is loaded with favorite recipes from localStorage
function favoritesPage(){
    window.open("./favorites.html", target="_self");
}


// EXECUTION //

//Run initial recipe API call
getRecipes();

// Asks for user location when loading site
navigator.geolocation.getCurrentPosition(success, error);

// Listens for a click of the search button
submitButtonEl.addEventListener("click", getRecipes);

// Loads Favorites page
favoriteButtonEl.addEventListener("click", favoritesPage);


