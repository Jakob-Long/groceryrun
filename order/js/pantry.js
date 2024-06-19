document.addEventListener('DOMContentLoaded', function() {
    showLoadingPopup();
    displayPantry();
});

async function displayPantry() {
    try {
        const apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=spice&json=true'; // Change the search term to "fruits vegetables"
        const response = await fetch(apiUrl);
        const data = await response.json();

        hideLoadingPopup();

        const pantryContainer = document.getElementById('pantry-products'); // Change to the appropriate container ID for fruits and vegetables products
        const itemCountElement = document.getElementById('item-count');
        
        if (data && data.products && data.products.length > 0) {
            pantryContainer.innerHTML = ''; // Clear previous results
            
            const itemCount = data.products.length;
            itemCountElement.textContent = `Showing ${itemCount} items`;

            data.products.forEach(product => {
                const productElement = createProductElement(product);
                pantryContainer.appendChild(productElement);
            });
        } else {
            pantryContainer.textContent = 'No pantry products found.'; // Change to appropriate message for fruits and vegetables products
        }
    } catch (error) {
        console.error('Error fetching pantry products:', error); // Change to appropriate error message for fruits and vegetables products
        const pantryContainer = document.getElementById('pantry-products'); // Change to the appropriate container ID for fruits and vegetables products
        pantryContainer.textContent = 'Error fetching pantry products.'; // Change to appropriate error message for fruits and vegetables products
    }
}

// Function to create product element
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    // Check if the name or brand is long
    const isLongName = product.product_name.length > 20; // Adjust the threshold as needed
    const isLongBrand = product.brands.length > 20; // Adjust the threshold as needed

    if (isLongName) {
        productElement.classList.add('long-name');
    }

    if (isLongBrand) {
        productElement.classList.add('long-brand');
    }

    productElement.innerHTML = `
        <img src="${product.image_url}" alt="${product.product_name}">
        <div class="product-info">
            <h2>${product.product_name}</h2>
            <p>${product.brands}</p>
            <button class="add-button">+</button>
        </div>
    `;

    const addButton = productElement.querySelector('.add-button');
    addButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling up to product container
        const name = product.product_name;
        const brand = product.brands;
        addToCart(name, brand); // Call function to add to cart
    });

    return productElement;
}

// Function to add product to cart
function addToCart(name, brand) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get existing cart or initialize as empty array
    cart.push({ name, brand }); // Add new item to cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
    console.log('Cart:', cart); // Log updated cart to console
    showPopup();
}

// Function to show popup
function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Hide popup after 3 seconds
}

function showLoadingPopup() {
    const loadingPopup = document.getElementById('loading-popup');
    loadingPopup.style.display = 'block';
}

function hideLoadingPopup() {
    const loadingPopup = document.getElementById('loading-popup');
    loadingPopup.style.display = 'none';
}

// DEVELOPMENTAL PURPOSES BELOW
document.addEventListener('keydown', function(event) {
    if (event.key === 'c') {
        clearCart();
    }
});

// Function to clear cart
function clearCart() {
    localStorage.removeItem('cart');
    console.log('Cart cleared!');
}