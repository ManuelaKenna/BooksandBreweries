var cityinput = document.getElementById("cityInput");
var citysubmit = document.getElementById("cityInputSubmit");
var bookinput = document.getElementById("bookInput");
var booksubmit = document.querySelector(".submit");
var logo_name = document.getElementById("logo_name");
// const nameInput = document.getElementById('name-signup');
// const emailInput = document.getElementById('email-signup');
// const passwordInput = document.getElementById('password-signup');
// const signupsubmit = document.querySelector('.signin-form');

// //function to make sure only one checkbox can be selected at a time
// $(document).ready(function () {
//   $('.check').click(function () {
//     $('.check').not(this).prop('checked', false);
//   });
// });
document.getElementById("logo_name").addEventListener("click", function (event) {
  event.preventDefault();

  const getTerms = async () => {
    const count = 2;
    const result = await fetch(`http://localhost:3001/api/random/${count}`, {
      method: 'GET',
    });
    const json = await result.json();
    return json;
  };
  getTerms().then((response) => document.getElementById("logo_name").textContent = `${response[0].random_word} and ${response[1].random_word}`);
});

if (document.getElementById("cityInputSubmit")) {
  document.getElementById("cityInputSubmit").addEventListener("click", function (event) {
    event.preventDefault();
    let searchTerm = '';
    //checking to see what the user checked for pet preference
    if (document.getElementById("checkbox1").getAttribute('checked')) {
      searchTerm = 'Breweries';
    }
    if (document.getElementById("checkbox2").getAttribute('checked')) {
      searchTerm = 'Beer';
    }
    if (document.getElementById("checkbox3").getAttribute('checked')) {
      searchTerm = 'Cider';
    }
    if (document.getElementById("checkbox4").getAttribute('checked')) {
      searchTerm = 'Wine';
    }
    let selectedRadius = 16093; // document.getElementById('select').value;
    let address = cityinput.value || cityinput.placeholder;
    mapResults(address, searchTerm, selectedRadius);
  });
};

function geocoding(address) {
  const api = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC1H0tMJF0rY1i56Pq9L_9SVYccaU_mJOE`
  var latlng = fetch(api)
    .then((response) => {
      if (response.status === 200) {
      }
      return response.json();
    })
    .then(function (data) {
      const resultObject = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
      return resultObject;
    })
  return latlng;
}

function mapResults(address, searchTerm, selectedRadius) {
  let latlng = geocoding(address);
  latlng.then((latlng) => {
    let map;
    let service;
    let infowindow;

    function initMap(latlng, searchTerm, selectedRadius) {
      let geoLocation = new google.maps.LatLng(latlng.lat, latlng.lng);
      infowindow = new google.maps.InfoWindow();
      map = new google.maps.Map(
        document.getElementById('map'), { center: geoLocation, zoom: 13 });
      let request = {
        location: geoLocation,
        radius: selectedRadius,
        query: searchTerm,
      };
      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback);
    }
    //running google map api function
    initMap(latlng, searchTerm, selectedRadius);
    //function to check if marker has already been placed 
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          let place = results[i];
          createMarker(results[i]);
        }
      }
    }
    //function to place markers on the map produced from google API
    function createMarker(place) {
      new google.maps.Marker({
        position: place.geometry.location,
        map: map
      });
    }
  });
}

if (document.getElementById("bookInputSubmit")) {
  document.getElementById("bookInputSubmit").addEventListener("click", function (event) {
    event.preventDefault();
    const Booklist = document.getElementById("content");
    removeAllChildNodes(Booklist);
    bookapi();
    //getTerms().then((response) => response.forEach((item) => console.log(item)));
  });
}
function bookapi() {
  let bookInfo = bookinput.value || bookinput.placeholder;
  const api = `https://www.googleapis.com/books/v1/volumes?q=${bookInfo}`
  var bookData = fetch(api)
    .then((response) => {
      if (response.status === 200) {
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      handleResponse(data);
      return data;
    })
  return bookData;
};

const getTerms = async () => {
  const result = await fetch('http://localhost:3001/books/api/test', {
    method: 'GET',
  });
  const json = await result.json();
  return json;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function handleResponse(response) {
  for (var i = 0; i < response.items.length; i++) {
    var item = response.items[i];
    // in production code, item.text should have the HTML entities escaped.
    document.getElementById("content").innerHTML +=
      `
    <div class="card">
    <img class="card-img-top" src="${item.volumeInfo.imageLinks.thumbnail}" alt="Card image cap">
    <div class="card-body text-center">
      <h5 class="card-title">${item.volumeInfo.title}</h5>
      <a href="${item.volumeInfo.previewLink}" target="_blank" class="btn btn-primary">BUY</a>
      <h5>Bookmark</h5><span class="material-symbols-outlined" id="booksave${i}">bookmark</span>
    </div>
  </div>
  `
    document.querySelector(`#booksave${i}`).addEventListener("click", function (event) {
      event.preventDefault();
      console.log(response.items[i].volumeInfo.imageLinks.thumbnail);
    });
  }
}