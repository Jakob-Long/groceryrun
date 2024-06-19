// In your add-item.js file
document.addEventListener('DOMContentLoaded', function() {
    const addNewItemBtn = document.getElementById('addNewItemBtn');
    addNewItemBtn.addEventListener('click', function() {
        // Get input values
        const itemName = document.getElementById('itemName').value.trim();
        const brand = document.getElementById('brand').value.trim();
        const itemCount = parseInt(document.getElementById('itemCount').value.trim());

        // Validate input
        if (itemName === '') {
            alert('Please enter item name');
            return;
        }

        if (isNaN(itemCount) || itemCount < 1) {
            alert('Please enter a valid item count');
            return;
        }

        // Construct item object
        const item = {
            name: itemName,
            brand: brand,
            count: itemCount
        };

        // Get existing cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Add new item to cart
        cartItems.push(item);

        // Save updated cart items to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        showPopup();
    });
});

function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Hide popup after 3 seconds
}