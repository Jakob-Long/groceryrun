document.addEventListener('DOMContentLoaded', function() {
    displaySearchResults();
});

function displaySearchResults() {
    const resultsDiv = document.getElementById('results');
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    const itemCount = searchResults ? searchResults.length : 0; // Get the item count

    const itemCountElement = document.getElementById('item-count');
    itemCountElement.textContent = `Showing ${itemCount} items`;
    
    if (searchResults && searchResults.length > 0) {
        resultsDiv.innerHTML = ''; // Clear previous results
        
        searchResults.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image_url}" alt="${product.product_name}">
                <div class="product-info">
                    <h2>${product.product_name}</h2>
                    <p>${product.brands}</p>
                    <button class="add-button">+</button> <!-- Updated button class -->
                </div>
            `;
            resultsDiv.appendChild(productElement);

            const addButton = productElement.querySelector('.add-button');
            addButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent event from bubbling up to product container
                const name = product.product_name;
                const brand = product.brands;
                addToCart(name, brand); // Call function to add to cart
            });
        });
    } else {
        resultsDiv.innerHTML = 'No search results available.';
    }
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

// DEVELOPMENTAL PURPOSES BELOW
document.addEventListener('keydown', function(event) {
    if (event.key === 'c') {
        clearCart();
    }
});

function clearCart() {
    localStorage.removeItem('cart');
    console.log('Cart cleared!');
}