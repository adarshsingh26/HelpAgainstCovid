
var x = document.getElementById("demo");
var mapBtn = document.getElementById("mapButon")
var locBtn = document.getElementById("locateButton")
var infTxt = document.getElementById("infoText")
var user_latitude = 0;
var user_longitude = 0;
var plotData = ""
var markers = []

function getLocation() {
  if (navigator.geolocation) {
    infTxt.style.visibility = "visible";
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  user_latitude = position.coords.latitude;
  user_longitude = position.coords.longitude;
  console.log(user_latitude, user_longitude)
 // x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
//  x.innerHTML = "Latitude: " + user_latitude + "<br>Longitude: " + user_longitude;
  sendData()
}

function sendData(){
    axios.post("https://helpagainstcovid.co/loc",{
        latitude: user_latitude,
        longitude: user_longitude
    }).then(response => {
        plotData = response.data;
        infTxt.style.visibility = "hidden";
        mapBtn.disabled = false;
        locBtn.disabled = true;
    });
}

//=================================================

//function waitForData(){
//    while(true){
//        if(plotData){
//            break;
//        }
//    }
//}


function initMap(){
      //getLocation()

      // Map options
      //waitForData()
      var options = {
        zoom:9,
        center:{lat:user_latitude,lng:user_longitude}
      }

      console.log(options)

      var map = new google.maps.Map(document.getElementById('map'), options);


      for (const item in plotData){
        var hospital = plotData[item]["hospital"]
        var address = plotData[item]["address"]
        var beds = plotData[item]["beds"]
        var la = parseFloat(plotData[item]["latitude"])
        var lo = parseFloat(plotData[item]["longitude"])
        markers.push({
            coords:{lat:la,lng:lo},
            iconImage:'https://helpagainstcovid.co/static/images/hospital.png',
            content:'<h3>'+hospital+'</h3><br><p>'+address+'</p><br>Beds Available: <b>'+beds+'</b'
        })
      }

      console.log(markers)
      for(var i = 0;i < markers.length;i++){
        addMarker(markers[i]);
      }


      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          icon:props.iconImage
        });


          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });

      }
    }

