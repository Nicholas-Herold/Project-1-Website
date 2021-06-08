let zip = "";

// Function finds list of reaurants in the area based on lat and lon
function Getrestaurants(lat,lon) {
    fetch('https://api.documenu.com/v2/restaurants/search/geo?key=5162cc5a0a88bba9f4483c32d07d87f7&lat='+ lat +'&lon='+lon+'&distance=1&fullmenu')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        console.log(data);
    });
}

function Ziprestaurants(zipcode) {
    fetch('https://api.documenu.com/v2/restaurants/zip_code/'+zipcode+'?key=5162cc5a0a88bba9f4483c32d07d87f7&size=10')
    .then(response => {
      return response.json();  
    })
    .then (data =>{
        console.log(data);
    });
}


function success(pos) {
    let latitude = pos.coords.latitude
    console.log(latitude)
    let longitude = pos.coords.longitude
    console.log(longitude)  
    Getrestaurants(latitude,longitude)  
}

function error(){
    // display zipcode search if location not granted
    zip = '53094'
    Ziprestaurants(zip)
}

navigator.geolocation.getCurrentPosition(success, error)