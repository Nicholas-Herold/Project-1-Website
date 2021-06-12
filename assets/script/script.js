// VARIABLES //
let zip = "";
var searchTermsEl = document.getElementById('userInput'); // Search terms to be included in the search.  Entered in search box by user
var dFreeEl = document.getElementById('dairy'); // This option is selected or not by the user
var eFreeEl = document.getElementById('egg'); // This option is selected or not by the user
var gFreeEl = document.getElementById('gluten'); // This option is selected or not by the user
var wFreeEl = document.getElementById('wheat'); // This option is selected or not by the user
var pFreeEl = document.getElementById('peanut'); // This option is selected or not by the user
var submitButtonEl = document.querySelector("#searchButton"); // This is the Search Button
var submitButtonE2 = document.getElementById('zipbtn');
var ziptxt = document.getElementById('ziptxt');
var zipinput = document.getElementById('zipinput');
var ziperror = "";

var divsectionEl = document.querySelector("#restsection");


var recipeTableBody = document.getElementById('recipeList');
var seeMoreRecBtn = document.getElementById('moreRec');
var recListHeader = document.getElementById('recipeListHeader');
var videoContainer = $('#videoContainer');
var displayMoreRecipes = 10;

var displayRestaurants = 5;

//Input personal api info for sites
var apiIDEdamam = 'e60d435c';
var apiKeyEdamam = '18c34531a5ee1f4b51fad57248de2882';
var apiKeyDocuMenu = 'a048f58582824f51ac9c1b6b4e500d9a';
//orig key and id for Edamam '&app_id=64678b5a&app_key=a6ff725866ecd49b95adf40a798e58fb'
//orig key for documenu key=5162cc5a0a88bba9f4483c32d07d87f7

// THIS WILL RETURN TWO RECIPES "ON SEARCH".  TO CHANGE, EDIT API URL FROM "&to=2" TO &to='desired number of recipes'
// MAY CONSIDER ADDING 'SUGGESTED SEARCH TERMS' SUCH AS "INSTANT POT POTATOES", "INDIAN CHICKEN" OR "BEEF AND ONIONS"
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

    var apiRecUrl = 'http://api.edamam.com/search?' + stIndicator + dfIndicator + efIndicator + gfIndicator + wfIndicator + pfIndicator + '&app_id=' + apiIDEdamam+ '&app_key=' + apiKeyEdamam + '&from=0&to=30&imageSize=THUMBNAIL';
    console.log(apiRecUrl);
    fetch(apiRecUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (recipedata) {
                    // console.log(recipedata);
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
    // console.log(data.hits[0].recipe.cuisineType.toString());
    var recipeTable = '';

    for (var i = 0; i < numberOfListItems; i++) {
        var item = data.hits[i];
        var recipeName = item.recipe.label;
        var recipeImage = item.recipe.image;
        var cookYield = item.recipe.yield;

        link = item.recipe.url.toString();
        cuisine = item.recipe.cuisineType.toString();
        type = item.recipe.mealType.toString();
        diet = item.recipe.dietLabels.toString();
        searchModal = '<p><button class="button" data-open="modal' + i + '">' + recipeName + '</button></p><div class="small reveal" id="modal' + i + '" data-reveal><div class="recipe-modal"><h1 class="recipe-title">' + recipeName + '</h1><img class="modal-image" src="' + recipeImage + '" alt=""><p>Meal type: ' + type + '</p><p>Cuisine type: ' + cuisine + '</p><p>Diet: ' + diet + '</p><a class="modal-link" href="' + link + '">Link to recipe</a></div><button class="close-button" data-close aria-label="Close reveal" type="button"><span aria-hidden="true">&times;</span></button></div>';
        
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

//Run initial recipe API call
getRecipes();


// Function finds list of restaurants in the area based on lat and lon
function Getrestaurants(lat, lon) {

    fetch('https://api.documenu.com/v2/restaurants/search/geo?key='+ apiKeyDocuMenu +'&lat='+ lat +'&lon='+lon+'&distance=1&fullmenu')
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
function Ziprestaurants() {
    document.querySelector("#restsection").innerHTML = ""
    let zipcode = zipinput.value
    console.log(zipcode)
    fetch('https://api.documenu.com/v2/restaurants/zip_code/' + zipcode + '?key=5162cc5a0a88bba9f4483c32d07d87f7&size=10')
        .then(response => {
            return response.json();
        })
        .then(data => {
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
    zipbtn.style.display='block';
    document.getElementById("autolocat").style.display="none";

}

// This function uses the Restaurant API to create a list <divs> of 5 local restaurants
function popRestList(data) {
    console.log(data);

    var datarray = data.data; // Data is returned as an object.  This pulls out the data array from the object called data.

    // divsectionEL is the variable that represents the location in the HTML where the new div is created.  It is identified by #restsection
    // divEl is the variable associated with the new div element.  It contains the restaurant name
    // divElp is the variable associated with the p element containing the phone number that is attached to the div
    // divEls is the variable associated with p element containing the street address that is attached to the div
    // divElc is the variable associated with p element containing the city, state, zip info that is attached to the div
    //divEla is the variable associated with p element containing restaurant website
    if (datarray.length == 0){
        var divsectionEl = document.querySelector("#restsection");
        divsectionEl.classList.remove("hide");
        document.querySelector("#restsection").innerHTML="No Results for this area"
        error();
    }


    divsectionEl.innerHTML = '';
    for (var i = 0; i < displayRestaurants; i++) {
        console.log(datarray);
        var divEl = document.createElement("div");
        divEl.classList = "rName";
        divEl.innerHTML = datarray[i].restaurant_name;


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
    //     createSeeMoreBtn(data);
    //     }
    
} // end of popRestList ()

// function createSeeMoreBtn(data) {
//     var SeeMoreBtn = document.createElement('button');
//     SeeMoreBtn.classList = 'button';
//     SeeMoreBtn.textContent = 'See More +';
//     SeeMoreBtn.type = 'button';
//     divsectionEl.appendChild(SeeMoreBtn);
//     createSeeMoreBtn.click(seeMoreRestClick(data));
// }

// function seeMoreRestClick(data){
//     displayRestaurants += 5;
//     popRestList(data);
// }

function renderTable(modal) {
    $('#recipeList').html(modal);
    $(document).foundation();
}

// asks for user location when loading site
navigator.geolocation.getCurrentPosition(success, error);


submitButtonEl.addEventListener("click", getRecipes); // Listens for a click of the search button