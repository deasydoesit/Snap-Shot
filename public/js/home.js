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
        if (locations.indexOf('Treny') != -1) {
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

    function concatType() {
        for (var i = 0; i < categoryArr.length; i++) {
            var plusString;
            if (i == 0) {
                plusString = categoryArr[i];
            } else {
                plusString += "+" + categoryArr[i];
            }
        }
        return plusString
    }

    function renderData() {
        for (var i = 0; i < data.length; i++) {
            var newDiv = $("<div>").attr({ "data-spotId": data.id });
            var newH4 = $("<h4>").text(data.location);
            var newImg = $("<img>").attr({ "src": data.path, "width": "200px", "height": "200px" });
            var newP = $("<p>").text(data.description);
            $(newDiv).append(newH4);
            $(newDiv).append(newImg);
            $(newDiv).append(newP);
            $("#spots-div").append(newDiv);
        }
    }

    function getByType() {
        var queryURL = "/api/spots/" + plusString;

        $.ajax({
            type: 'GET',
            url: queryURL
        }).then(function (data) {
            renderData();
        });

    }

    $(document).on("click", ".trendy-button", function () {
        $("spots-div").empty();
        categoryArr.push("trendy")
        concatType();
        getByType();
        renderData();
    });

    $(document).on("click", ".historical-button", function () {
        $("spots-div").empty();
        categoryArr.push("historical")
        concatType();
        getByType();
        renderData();
    });

    $(document).on("click", ".streetart-button", function () {
        $("spots-div").empty();
        categoryArr.push("streetart")
        concatType();
        getByType();
        renderData();
    });

    $(document).on("click", ".vista-button", function () {
        $("spots-div").empty();
        categoryArr.push("vista")
        concatType();
        getByType();
        renderData();
    });

    $(document).on("click", ".nature-button", function () {
        $("spots-div").empty();
        categoryArr.push("nature")
        concatType();
        getByType();
        renderData();
    });

    $(document).on("click", "#global", function () {

        $.ajax({
            type: 'GET',
            url: '/api/spots'
        }).then(function (data) {
            renderData();
        });



    });
});