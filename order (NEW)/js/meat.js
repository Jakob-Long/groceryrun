document.addEventListener('DOMContentLoaded', function() {
    displayMeatProducts();
});

async function displayMeatProducts() {
    try {
        const apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=meat&json=true'; // Change the search term to "meat"
        const response = await fetch(apiUrl);
        const data = await response.json();

        const meatProductsContainer = document.getElementById('meat-products'); // Change to the appropriate container ID for meat products
        const itemCountElement = document.getElementById('item-count');
        
        if (data && data.products && data.products.length > 0) {
            meatProductsContainer.innerHTML = ''; // Clear previous results
            
            const itemCount = data.products.length;
            itemCountElement.textContent = `Showing ${itemCount} items`;

            data.products.forEach(product => {
                const productElement = createProductElement(product);
                meatProductsContainer.appendChild(productElement);
            });
        } else {
            meatProductsContainer.textContent = 'No meat products found.'; // Change to appropriate message for meat products
        }
    } catch (error) {
        console.error('Error fetching meat products:', error); // Change to appropriate error message for meat products
        const meatProductsContainer = document.getElementById('meat-products'); // Change to the appropriate container ID for meat products
        meatProductsContainer.textContent = 'Error fetching meat products.'; // Change to appropriate error message for meat products
    }
}

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
