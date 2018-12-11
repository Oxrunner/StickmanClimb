var background = "cloud", latlng = new google.maps.LatLng(51.5072,0.1275), geocoder;
var result = document.getElementById("result");
var FLICKR_API_KEY = "777046e05c6ad632d78e47f1620aeccc";
var city = "";

function initialise(){
  geocoder = new google.maps.Geocoder();
  codeLatLng();

  setTimeout(function(){
    navigator.geolocation.getCurrentPosition(
      function(position){
        latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        codeLatLng();
      },
      function(error){
        var message = "";
        switch(error.code){
          case error.PERMISSION_DENIED:
            message = "You need to allow GeoLocation to allow the game to change the background accoring to the weather where you are.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "I can't find you!";
            break;
          case error.TIMEOUT:
            message = "It took too long to try to get your location.";
            break;
        }
        alert(message);
      }
    );
  }, 0);
}

function codeLatLng(){
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        for(var i=0,l=results[0].address_components.length; i<l; i++){
          if(results[0].address_components[i].types.indexOf("locality") >= 0){
            city = results[0].address_components[i].long_name;
            getWeather();
            return;
          }
        }
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}

function getWeather(){
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = "http://openweathermap.org/data/2.1/find/name?q="+city+"&callback=ChangeBackground";
  head.appendChild(script);
}

function ChangeBackground(results){
  var _city = results.list['0'];
  var weather = _city.weather['0'].description;
  makeRequest(weather);
}

function makeRequest(weather){
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+FLICKR_API_KEY+"&text="+weather+"%20image&per_page=10&format=json&jsoncallback=myCallback";
  head.appendChild(script);
}

function myCallback(data){
  if(data && data.photos && data.photos.photo && data.photos.photo.length > 0){
    var photo = data.photos.photo[0];
    var photoURL = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_z.jpg";
    document.getElementById("myCanvas").style.background = "url("+photoURL+") no-repeat center";
  }else{
    console.log("Sorry no Image was found");
  }
}
google.maps.event.addDomListener(window, 'load', initialise);