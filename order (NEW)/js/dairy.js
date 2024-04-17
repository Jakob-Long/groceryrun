// dairy.js

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=dairy&json=true';
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Check if data has products
        if (data && data.products && data.products.length > 0) {
            // Display dairy products
            displayDairyProducts(data.products);
        } else {
            // If no dairy products found
            displayNoDairyProductsMessage();
        }
    } catch (error) {
        console.error('Error fetching dairy products:', error);
        // Handle error - display error message to the user or handle it appropriately
    }
});

function displayDairyProducts(products) {
    const dairyProductsContainer = document.createElement('div');
    const itemCount = products.length;

    // Update item count
    const itemCountElement = document.getElementById('item-count');
    itemCountElement.textContent = `Total Items: ${itemCount}`;

    products.forEach(product => {
        const productName = product.product_name || 'Unknown Product';
        const productBrand = product.brands || 'Unknown Brand';
        const productImage = product.image_url || 'placeholder.jpg'; // Use placeholder image if actual image URL is not available
        
        const productElement = document.createElement('div');
        productElement.classList.add('dairy-product');
        productElement.innerHTML = `
            <img src="${productImage}" alt="${productName}" class="product-image">
            <div class="product-info">
                <div class="product-details">
                    <h2>${productName}</h2>
                    <p>Brand: ${productBrand}</p>
                    <button class="add-button">+</button>
                </div>
            </div>
            <!-- Add more product details here as needed -->
        `;
        
        dairyProductsContainer.appendChild(productElement);
    });

    // Append dairy products container to the page
    const dairyContainer = document.getElementById('dairy-products');
    dairyContainer.appendChild(dairyProductsContainer);
}
function displayNoDairyProductsMessage() {
    const message = document.createElement('p');
    message.textContent = 'No dairy products found.';
    document.body.appendChild(message);
}