var geocoder = new google.maps.Geocoder(); //initialize gooble maps geocoder

function displayImage(input) { //function to display images after being provided by user
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#placeholder-img')
                .attr('src', e.target.result)
                .css('display', 'block')
                .width(150)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {
    var locationButton = $('#location-button');
    var locationInput = $('#location-input');
    var spotForm = $('form#spot');
    var modalBtn = $('#modal-btn');
    var location = "";
    var historical = false;
    var vista = false;
    var trendy = false;
    var streetArt = false;
    var nature = false;
    var lat;
    var lng;

    var mymap = L.map('mapid', { center: [38.9072, -77.0369], zoom: 12, scrollWheelZoom: false, zoomControl: false}); //initialize map

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { 
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiamF5cmVkZDExIiwiYSI6ImNqaGdsaWF3dzFpZjYzZHAzeW4wbHNmb2UifQ.COxlVvDKbzGEnSyy5Um6vg'
    }).addTo(mymap);

    L.control.zoom({ //position zoom buttons
        position:'bottomleft'
    }).addTo(mymap);

    var offsetX = mymap.getSize().x*0.2; //offset center of the map to the left
    var offsetY = mymap.getSize().y*0.1; //offset center of the map upwards
    mymap.panBy(new L.Point(offsetX, offsetY), {animate: false}); //render map

    mymap.on('click', function() { //only enable map scrolling on map click
        if (mymap.scrollWheelZoom.enabled()) {
          mymap.scrollWheelZoom.disable();
        }
        else {
          mymap.scrollWheelZoom.enable();
        }
    });

    var myMapLayer = L.layerGroup([])
        .addTo(mymap);

    // function createMarker() {
    //     var myMapLayer = L.layerGroup([])
    //         .addTo(mymap);

    //     for (var i = 0; i < data.length; i++) {
    //         var popup = L.popup({ className: 'popup' })
    //             .setContent('<div class="popupDiv">' +
    //                 '<h6>' + data[i].location + '</h6>' +
    //                 '<img src="' + data[i].path + '" width="100px" height="100px">' +
    //                 '<p>' + 'Length: ' + data[i].description + ' miles' + '</p>' +
    //                 '</div>');

    //         marker = new L.marker([data[i].lat, data[i].lng])
    //             .bindPopup(popup)
    //             .addTo(myMapLayer);
    //     }
    // }

    google.maps.event.addDomListener(modalBtn, 'click', initLocation); //listen for location filed data entry by user for autocomplete

    locationButton.on('click', function () { //get location data on location button click
        locationInput.attr('placeholder', 'Getting location, please wait..');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                locationInput.val('Latitude: ' + lat + ', Longitude: ' + lng)
                    .attr({ 'data-lat': lat, 'data-long': lng, 'placeholder': 'Location' });
            });
        } else {
            x.innerHTML = 'Geolocation is not supported by this browser.';
        }
    });

    spotForm.on('submit', function (event) { //package form data and submit

        event.preventDefault();

        if (locationInput.attr('data-lat') == "") { //if the user isn't using their lat/lng location, find lat/lng
            geocoder.geocode({ address: locationInput.val() }, function (results, status) {
                if (status === 'OK') {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    location = locationInput.val();
                    createForm();
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        } else {
            createForm();
        }
    });

    function createForm() { //function to assist in form prep and submission
        //generate boolean for location type
        var locations = [];
        $.each($('select#type-input option:selected'), function () {
            locations.push($(this).val());
        });

        if (locations.indexOf('Historical') != -1) {
            historical = true;
        };
        if (locations.indexOf('Vista') != -1) {
            vista = true;
        };
        if (locations.indexOf('Trendy') != -1) {
            trendy = true;
        };
        if (locations.indexOf('Street Art') != -1) {
            streetArt = true;
        };
        if (locations.indexOf('Nature') != -1) {
            nature = true;
        };

        //prep and create form object
        var formData = new FormData();

        formData.append('location', location);
        formData.append('lat', lat);
        formData.append('lng', lng);
        formData.append('tod', $('select#tod-input option:selected').val());
        formData.append('historical', historical);
        formData.append('vista', vista);
        formData.append('trendy', trendy);
        formData.append('street_art', streetArt);
        formData.append('nature', nature);
        formData.append('description', $('textarea#description-input').val().trim());
        formData.append('photo', $('input#file-input')[0].files[0]);

        //transmit form object server-side
        $.ajax({
            type: 'POST',
            url: '/api/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                document.getElementById('spot').reset();
                $('#placeholder-img').css('display', 'none');
                alert(data);
            }
        });
    }

    var categoryArr = [];

    // function concatType() {
    //     var plusString;

    //     for (var i = 0; i < categoryArr.length; i++) {
    //         if (i == 0) {
    //             plusString = categoryArr[i];
    //         } else {
    //             plusString += "+" + categoryArr[i];
    //         }
    //     }
    //     return plusString
    // }


    function getByType() {
        var plusString = '';

        for (var i = 0; i < categoryArr.length; i++) {
            if (i == 0) {
                plusString = categoryArr[i];
            } else {
                plusString += "+" + categoryArr[i];
            }
        }

        var queryURL = "/api/spots/" + plusString;

        $.ajax({
            type: 'GET',
            url: queryURL
        }).then(function (data) {
            mymap.removeLayer(myMapLayer);
            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>").attr({ "data-spotId": data[i].id });
                var newH4 = $("<h4>").text(data[i].location);
                var newImg = $("<img>").attr({ "src": data[i].path, "width": "auto", "height": "200px" });
                var newP = $("<p>").text(data[i].description);
                $(newDiv).append(newH4);
                $(newDiv).append(newImg);
                $(newDiv).append(newP);
                $("#spots-div").append(newDiv);
            }
            myMapLayer = L.layerGroup([])
                .addTo(mymap);

            for (var i = 0; i < data.length; i++) {
                var popup = L.popup({ className: 'popup' })
                    .setContent('<div class="popupDiv">' +
                        '<h6>' + data[i].location + '</h6>' +
                        '<img src="' + data[i].path + '" width="100px" height="100px">' +
                        '<p>' + 'Length: ' + data[i].description + ' miles' + '</p>' +
                        '</div>');

                marker = new L.marker([data[i].lat, data[i].lng])
                    .bindPopup(popup)
                    .addTo(myMapLayer);
            }
            $("#spots-div").css("display", "block");
        });

    }

    $(document).on("click", "#trendy-button", function () {
        $("#spots-div").empty();
        categoryArr.push("trendy");
        console.log(categoryArr);
        getByType();
        $("#spots-div").css("display", "block");
    });

    $(document).on("click", "#historical-button", function () {
        $("#spots-div").empty();
        categoryArr.push("historical");
        console.log(categoryArr);
        var plusString;
        for (var i = 0; i < categoryArr.length; i++) {
            if (i == 0) {
                plusString = categoryArr[i];
            } else {
                plusString += "+" + categoryArr[i];
            }
        }
        console.log(plusString);
        var queryURL = "/api/spots/" + plusString;
        console.log(queryURL);
        $.ajax({
            type: 'GET',
            url: queryURL
        }).then(function (data) {
            console.log(data);
            mymap.removeLayer(myMapLayer);
            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>").attr({ "data-spotId": data[i].id });
                var newH4 = $("<h4>").text(data[i].location);
                var newImg = $("<img>").attr({ "src": data[i].path, "width": "auto", "height": "200px" });
                var newP = $("<p>").text(data[i].description);
                $(newDiv).append(newH4);
                $(newDiv).append(newImg);
                $(newDiv).append(newP);
                $("#spots-div").append(newDiv);
            }
            myMapLayer = L.layerGroup([])
                .addTo(mymap);

            for (var i = 0; i < data.length; i++) {
                var popup = L.popup({ className: 'popup' })
                    .setContent('<div class="popupDiv">' +
                        '<h6>' + data[i].location + '</h6>' +
                        '<img src="' + data[i].path + '" width="100px" height="100px">' +
                        '<p>' + 'Length: ' + data[i].description + ' miles' + '</p>' +
                        '</div>');

                marker = new L.marker([data[i].lat, data[i].lng])
                    .bindPopup(popup)
                    .addTo(myMapLayer);
            }
            $("#spots-div").css("display", "block");
        });

    });

    $(document).on("click", "#streetart-button", function () {
        $("#spots-div").empty();
        categoryArr.push("street_art");
        console.log(categoryArr);
        getByType();
        $("#spots-div").css("display", "block");
    });

    $(document).on("click", "#vista-button", function () {
        $("#spots-div").empty();
        categoryArr.push("vista");
        console.log(categoryArr);
        getByType();
        $("#spots-div").css("display", "block");
    });

    $(document).on("click", "#nature-button", function () {
        $("#spots-div").empty();
        categoryArr.push("nature");
        console.log(categoryArr);
        getByType();
        $("#spots-div").css("display", "block");
    });

    $(document).on("click", "#global", function () {

        $.ajax({
            type: 'GET',
            url: '/api/spots/'
        }).then(function (data) {
            console.log(data);
            $("#spots-div").empty();
            mymap.removeLayer(myMapLayer);

            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>").attr({ "data-spotId": data[i].id, "class": "spot-div" });
                var newImg = $("<img>").attr({ "src": data[i].path, "width": "auto", "height": "200px" });
                var newH4 = $("<h4>").text(data[i].location);
                var FavButton = $("<button>").text("Favorite").attr({"type": "button", "class": "btn btn-default btn-large favorites", "data-id": data[i].id});
                var starSpan = $("<span>").attr({"class": "glyphicon glyphicon-star", "aria-hidden": "true"});
                $(FavButton).append(starSpan);
                var newP = $("<p>").text(data[i].description);
                $(newDiv).append(header);
                $(newDiv).append(newH4);
                $(newDiv).append(newImg);
                $(newDiv).append(FavButton);
                $(newDiv).append(newP);
                $("#spots-div").append(newDiv);
            }
            var header = $("<h6>").text("DC Spots").attr("class", "spot-header")
            $("#spots-div").prepend(header);
            
            myMapLayer = L.layerGroup([])
                .addTo(mymap);

            for (var i = 0; i < data.length; i++) {
                var popup = L.popup({ className: 'popup' })
                    .setContent('<div class="popupDiv">' +
                        '<h6>' + data[i].location + '</h6>' +
                        '<img src="' + data[i].path + '" width="100px" height="100px">' +
                        '<p>' + data[i].description + '</p>' +
                        '</div>');

                marker = new L.marker([data[i].lat, data[i].lng])
                    .bindPopup(popup)
                    .addTo(myMapLayer);
            }
            $("#spots-div").css("display", "block");
        });



    });

    // function renderData() {
    //     for (var i = 0; i < data.length; i++) {
    //         var newDiv = $("<div>").attr({ "data-spotId": data.id });
    //         var newH4 = $("<h4>").text(data.location);
    //         var newImg = $("<img>").attr({ "src": data.path, "width": "auto", "height": "200px" });
    //         var newP = $("<p>").text(data.description);
    //         $(newDiv).append(newH4);
    //         $(newDiv).append(newImg);
    //         $(newDiv).append(newP);
    //         $("#spots-div").append(newDiv);
    //     }
    // }

});