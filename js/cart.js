document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});

async function handleSubmit(event) {
    const groceryItems = ['peanut butter', 'jif', 'traditional sauce', 'pasta', 'macaroni','cheese'];
    const randomIndex = Math.floor(Math.random() * groceryItems.length);
    const query = groceryItems[randomIndex];

    if (query) {
        try {
            const apiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page_size=10&json=true`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Store the search results locally
            localStorage.setItem('searchResults', JSON.stringify(data.products));
            
            // Navigate to the results page
            window.location.href = `search-results.html`;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Display error message to the user or handle it appropriately
        }
    }
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const itemCountText = document.getElementById('item-count');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length > 0) {
        cartItemsDiv.innerHTML = ''; // Clear previous items

        // Create an object to store counts for each item
        const itemCounts = {};

        // Loop through the cart items and update counts
        cartItems.forEach(item => {
            const key = `${item.name}:${encodeURIComponent(item.brand)}`;
            itemCounts[key] = (itemCounts[key] || 0) + (item.count || 1); // Update count correctly, ensure count is at least 1
        });        

        let totalItemCount = 0; // Initialize total item count
        Object.keys(itemCounts).forEach(key => {
            const count = itemCounts[key];

            totalItemCount += count; // Update total item count

            const [itemName, encodedBrand] = key.split(':');
            // Decode the brand name back to its original form
            const itemBrand = decodeURIComponent(encodedBrand);

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-info">
                    <h2>${itemName} - ${count} count</h2>
                    <p>${itemBrand}</p>
                    <button class="add-button">+</button>
                    <button class="remove-button" style="display: none;"><img src="img/trash-bin.png" alt="Trash Icon"></button>
                </div>
            `;
            cartItemsDiv.appendChild(itemElement);
        });

        // Update the total item count text
        itemCountText.textContent = `${totalItemCount} items`;
        
        // Add swipe-to-left functionality
        addSwipeToRevealRemove();
        // Add event listeners for add buttons
        addEventListenersToAddButtons();
    } else {
        cartItemsDiv.innerHTML = `
            <button class="add-first-item" onclick="addFirstItem()"><p class="add-first-item-text">Add your first item!</p></button>
        `;
        itemCountText.textContent = '0 items'; // Set total item count to 0 if cart is empty
    }
}

function addFirstItem() {
    handleSubmit({
        preventDefault: () => {},
        target: { value: "peanut butter" } // Simulate the search input value
    });
}

function addSwipeToRevealRemove() {
    const cartItemsDiv = document.getElementById('cart-items');

    let startX;
    let startLeft;

    cartItemsDiv.addEventListener('touchstart', (event) => {
        const cartItem = event.target.closest('.cart-item');
        if (cartItem) {
            startX = event.touches[0].clientX;
            startLeft = cartItem.getBoundingClientRect().left;
        }
    });    

    cartItemsDiv.addEventListener('touchmove', (event) => {
        const diffX = event.touches[0].clientX - startX;
        const item = event.target.closest('.cart-item');
        if (item) {
            item.style.left = `${Math.min(0, startLeft + diffX)}px`; // Only move left
            
            // Show remove button when swiping left
            const removeButton = item.querySelector('.remove-button');
            if (Math.min(0, startLeft + diffX) < 0) {
                removeButton.style.display = 'block';
            } else {
                removeButton.style.display = 'none';
            }
        }
    });

    cartItemsDiv.addEventListener('touchend', (event) => {
        const item = event.target.closest('.cart-item');
        const removeButton = event.target.closest('.remove-button');
        if (item) {
            const currentPosition = parseInt(item.style.left) || 0;
            if (startX - event.changedTouches[0].clientX > 50 && !removeButton) {
                // Swipe threshold exceeded and not a click on remove button, move item to the left
                item.style.left = '-100px'; // Move item to the left to reveal remove button
            } else if (currentPosition < 0 && currentPosition > -100) {
                // Item is partially swiped, snap back to original position
                item.style.left = '0px';
            }
        }
    });        

    cartItemsDiv.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.remove-button');
        if (removeButton) {
            const cartItem = event.target.closest('.cart-item');
            const itemName = cartItem.querySelector('h2').textContent.split(' - ')[0];
            const itemBrand = cartItem.querySelector('p').textContent;
    
            // Prevent multiple calls
            event.stopPropagation();
    
            // Remove item locally
            removeItemFromCart(itemName, itemBrand);            
            // Remove item from DOM
            cartItem.remove();
        }
    });          
}

function removeItemFromCart(name, brand) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cartItems.findIndex(item => item.name === name && item.brand === brand);
    if (index !== -1) {
        // Remove one item at a time
        cartItems[index].count = Math.max(0, cartItems[index].count - 1);
        console.log(cartItems[index].count);
        // Remove item if count reaches zero
        if (cartItems[index].count === 0) {
            cartItems.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        location.reload(); 
    }
}

function addEventListenersToAddButtons() {
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cartItem = button.closest('.cart-item');
            const itemName = cartItem.querySelector('h2').textContent.split(' - ')[0];
            const itemBrand = cartItem.querySelector('p').textContent;

            // Update count locally
            updateItemCount(itemName, itemBrand, 1);
        });
    });
}

function updateItemCount(name, brand, count) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cartItems.findIndex(item => item.name === name && item.brand === brand);
    if (index !== -1) {
        // If the item already exists in the cart, increment the count
        cartItems[index].count = (cartItems[index].count || 0) + count; // Initialize count to 0 if it doesn't exist
    } else {
        // If the item doesn't exist in the cart, add it with the provided count
        cartItems.push({ name: name, brand: brand, count: count });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update count in the corresponding item element
    const itemElements = document.querySelectorAll('.cart-item');
    itemElements.forEach(itemElement => {
        const itemNameElement = itemElement.querySelector('h2');
        const itemBrandElement = itemElement.querySelector('p');
        if (itemNameElement.textContent.split(' - ')[0] === name && itemBrandElement.textContent === brand) {
            itemNameElement.textContent = `${name} - ${cartItems[index].count} count`;
        }
    });
    displayCartItems();
    location.reload();
}

function clearCart() {
    localStorage.removeItem('cart');
    location.reload();
}

document.querySelector('.place-order').addEventListener('click', function() {
    window.location.href = 'schedule.html'; // Replace 'order.html' with the URL of the new page
});

// DEVELOPMENTAL PURPOSES BELOW
document.addEventListener('keydown', function(event) {
    if (event.key === 'c') {
        clearCart();
    }
});

function clearCart() {
    localStorage.removeItem('cart');
    console.log('Cart cleared!');
    displayCartItems();
}