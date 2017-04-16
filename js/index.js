
function predictPrice() {
	var time = $('#timeToSell').val();
	console.log('predicting the price for '+time+' days to sell');
	$.ajax({
		method: "GET",
		url: "/predict-price?time="+time,
		dataType: "json"
	}).done(function(response) {
		if (response.success) {
			price = response.price
			price = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			html = '<div class="alert alert-success">'
				+ 'You are most likely to sell in time if You set the price to '
				+ '<strong>$' + price + '</strong>.'
				+ '</div>'
			$('#pricePrediction').html(html);
		}
	});
};

function predictTime() {
	var price = $('#price').val();
	console.log('predicting the time for the price '+price);
	$.ajax({
		method: "GET",
		url: "/predict-time?price="+price,
		dataType: "json"
	}).done(function(response) {
		if (response.success) {
			time = response.time
			html = '<div class="alert alert-success">'
				+ 'For the price You set Your are most likely to sell in '
				+ '<strong>' + time + '</strong> days.'
				+ '</div>'
			$('#timePrediction').html(html);
		}
	});
};

function initMap() {
	var me = this;
	
	// initial center coordinates
    var center = {lat: 28.544719370308737, lng: -81.39152526855469};
    
    // create a map
    var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 7,
    	center: center
    });
    window.map = map;
    
    // try to center to clients position
    if (navigator.geolocation && false) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
    
    // add event listener for mouse click
    google.maps.event.addListener(map, 'click', function(event) {
    	if (window.marker) {
    		window.marker.setMap(null);
    	}
    	var marker = new google.maps.Marker({
	        position: event.latLng, 
	        map: map
	    });
    	window.marker = marker;
    	
    	// hide not selected and show lat lng
    	$('#locationNotSelected').hide();
    	$('#locationLatLng').html('Lat: '+event.latLng.lat()+', Lng: '+event.latLng.lng());
    	
    	$('#locationAddress').html('');
    	$.ajax({
    		method: "GET",
    		url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+event.latLng.lat()+","+event.latLng.lng()+"&key="+"AIzaSyDGWwRA4enXG5XSOOj5eNHNrhk362E8JTo",
    		dataType: "json"
    	}).done(function(response) {
    		if (response.status == 'OK' && response.results && response.results.length > 0) {
    			$('#locationAddress').html(response.results[0].formatted_address);
    		}
    	});
	});
};

