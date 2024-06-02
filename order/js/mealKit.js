document.addEventListener('DOMContentLoaded', function() {
    setupAddButtons();
    setupSeeInsideButtons();
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
