let map;
let service;
let infowindow;

function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: -33.867, lng: 151.195 } // Initial center
  });

  // Example address (optional initial search)
  const address = "735 Broadway, New York, NY 10003";
  geocodeAddress(address);
}

function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      findNearbyWarehouses(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function findNearbyWarehouses(location) {
  const request = {
    location: location,
    radius: 100, // Search within 100 meters
    keyword: "warehouse",
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    } else {
      alert("Places search was not successful for the following reason: " + status);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map, marker);
  });
}

function handleSearch() {
  const address = document.getElementById("address").value;
  if (address) {
    geocodeAddress(address);
  } else {
    alert("Please enter an address or place name.");
  }
}

window.initMap = initMap;
