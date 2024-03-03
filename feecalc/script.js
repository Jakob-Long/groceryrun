function calculateDistance() {
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(origin);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var originLat = data[0].lat;
            var originLon = data[0].lon;

            var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(destination);
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    var destLat = data[0].lat;
                    var destLon = data[0].lon;

                    var distanceInKm = calculateDistanceBetweenPoints(originLat, originLon, destLat, destLon);
                    var distanceInMiles = convertKmToMiles(distanceInKm);
                    var price = calculatePrice(distanceInMiles);
                    document.getElementById('result').innerHTML = 'Distance: ' + distanceInMiles.toFixed(2) + ' miles<br>Price: $' + price.toFixed(2);
                });
        })
        .catch(error => console.error('Error:', error));
}

function calculateDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function convertKmToMiles(km) {
    return km * 0.621371;
}

function calculatePrice(distanceInMiles) {
    var basePrice = 12;
    var pricePerMile = 3;
    var deliveryCheckbox = document.getElementById('delivery');
    if (deliveryCheckbox.checked) {
        return basePrice + (pricePerMile * distanceInMiles);
    } else {
        return basePrice;
    }
}
