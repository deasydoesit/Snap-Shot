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

    $(document).ready(function() {  
        var locationButton = $('#location-button');
        var locationInput = $('#location-input');
        var spotForm = $('form#spot');
        var modalBtn = $('#modal-btn');
        var historical = false;
        var vista = false;
        var trendy = false;
        var streetArt = false;
        var nature = false;
        var lat;
        var lng;

        google.maps.event.addDomListener(modalBtn, 'click', initLocation); //listen for location filed data entry by user for autocomplete

        locationButton.on('click', function(){ //get location data on location button click
            locationInput.attr('placeholder', 'Getting location, please wait..');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    locationInput.val('Latitude: ' + lat + ', Longitude: ' + lng)
                            .attr({'data-lat': lat, 'data-long': lng, 'placeholder': 'Location'});
                });
            } else { 
                x.innerHTML = 'Geolocation is not supported by this browser.';
            }
        });

        spotForm.on('submit', function(event) { //package form data and submit

            event.preventDefault();

            if (locationInput.attr('data-lat') == "") { //if the user isn't using their lat/lng location, find lat/lng
                geocoder.geocode({address: locationInput.val()}, function(results, status) {
                    if (status === 'OK') {
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
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
            $.each($('select#type-input option:selected'), function(){            
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
                success: function(data){
                    document.getElementById('spot').reset();
                    $('#placeholder-img').css('display', 'none');
                    alert(data);
                }
            });
        }
    });