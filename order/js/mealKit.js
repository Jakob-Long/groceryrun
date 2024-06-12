document.addEventListener('DOMContentLoaded', function() {
    setupAddButtons();
    setupSeeInsideButtons();
    showLocationPopup();
    getUserLocation();
});

function setupAddButtons() {
    const addButtons = document.querySelectorAll('.add-button');

    addButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productInfo = event.target.closest('.mealkit').querySelector('.product-info');
            const name = productInfo.querySelector('h2').textContent;
            const brand = 'Grocery Run'; // Hard-coded brand name

            addToCart(name, brand);
        });
    });
}

function setupSeeInsideButtons() {
    const seeInsideButtons = document.querySelectorAll('.see-inside-button');

    seeInsideButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productInfo = event.target.closest('.mealkit').querySelector('.product-info');
            const name = productInfo.querySelector('h2').textContent;
            const description = productInfo.querySelector('p').textContent;
            const items = event.target.getAttribute('data-items').split(', ');

            showDetailsPopup(name, description, items);
        });
    });
}

function addToCart(name, brand) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get existing cart or initialize as empty array
    cart.push({ name, brand }); // Add new item to cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
    console.log('Cart:', cart); // Log updated cart to console
    showPopup();
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Hide popup after 3 seconds
}

function showLocationPopup() {
    const locationPopup = document.getElementById('location-popup');
    locationPopup.classList.add('show');
    setTimeout(() => {
        locationPopup.classList.remove('show');
    }, 5000); // Hide popup after 5 seconds
}

function showDetailsPopup(name, description, items) {
    const detailsPopup = document.getElementById('details-popup');
    const detailsTitle = document.getElementById('details-title');
    const detailsDescription = document.getElementById('details-description');
    const detailsList = document.getElementById('details-list');

    // Check if the elements are found
    if (detailsTitle && detailsDescription && detailsList) {
        detailsTitle.textContent = name;
        detailsDescription.textContent = description;

        // Clear previous items
        detailsList.innerHTML = '';

        // Check if the "Includes:" heading already exists
        const existingIncludesHeading = detailsPopup.querySelector('h3.includes-heading');
        if (!existingIncludesHeading) {
            // Create and insert the "Includes:" heading
            const includesHeading = document.createElement('h3');
            includesHeading.textContent = 'Includes:';
            includesHeading.classList.add('includes-heading');
            detailsList.parentNode.insertBefore(includesHeading, detailsList);
        }

        // Add new items to the details list
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            detailsList.appendChild(listItem);
        });

        detailsPopup.style.display = 'flex';
    } else {
        console.error("Details elements not found");
    }
}

function hideDetailsPopup() {
    const detailsPopup = document.getElementById('details-popup');
    detailsPopup.style.display = 'none';
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const storeLat = 46.7729; // Latitude of 203 Main Street, Fort Fairfield, ME 04742
    const storeLon = -67.8333; // Longitude of 203 Main Street, Fort Fairfield, ME 04742
    const distance = calculateDistance(userLat, userLon, storeLat, storeLon);

    addShippingCostToPrices(distance);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateShippingCost(distance) {
    distance = Math.round(distance);
    if (distance <= 1) return 5;
    if (distance >= 1 && distance <= 2) return 9;
    if (distance >= 2 && distance <= 3) return 12;
    if (distance >= 3 && distance <= 4) return 14;
    return 15;
}


function addShippingCostToPrices(distance) {
    const shippingCost = calculateShippingCost(distance);

    const mealkits = document.querySelectorAll('.mealkit');
    mealkits.forEach(mealkit => {
        const priceElement = mealkit.querySelector('.price');
        const noSalePriceElement = mealkit.querySelector('.noSale-price');
        let basePrice = 0;
        let salePrice = 0;

        if (priceElement) {
            const originalPriceText = priceElement.querySelector('.original-price').textContent.replace('$', '');
            const salePriceText = priceElement.querySelector('.sale-price').textContent.replace('$', '');
            basePrice = parseFloat(originalPriceText);
            salePrice = parseFloat(salePriceText);
        } else if (noSalePriceElement) {
            const noSalePriceText = noSalePriceElement.textContent.replace('$', '');
            basePrice = parseFloat(noSalePriceText);
            salePrice = basePrice;
        }

        const newBasePrice = Math.round(basePrice + shippingCost);
        const newSalePrice = Math.round(salePrice + shippingCost);

        if (priceElement) {
            priceElement.querySelector('.original-price').textContent = `$${newBasePrice}`;
            priceElement.querySelector('.sale-price').textContent = `$${newSalePrice}`;
        } else if (noSalePriceElement) {
            noSalePriceElement.textContent = `$${newBasePrice}`;
        }
    });
}