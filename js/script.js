document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSubmit);

    // Add event listeners to food group elements
    const foodGroups = document.querySelectorAll('.food-group');
    foodGroups.forEach(group => {
        group.addEventListener('click', () => {
            const groupId = group.id;
            // Construct URL based on food group id
            const url = `food groups/${groupId}.html`;
            // Navigate to the corresponding page
            window.location.href = url;
        });
    });

    const mealKit = document.querySelectorAll('.mealKit');
    mealKit.forEach(group => {
        group.addEventListener('click', () => {
            const groupId = group.id;
            // Construct URL based on food group id
            const url = `food groups/${groupId}.html`;
            // Navigate to the corresponding page
            window.location.href = url;
        });
    });

    const attachedRectangle = document.querySelectorAll('.attached-rectangle');
    attachedRectangle.forEach(group => {
        group.addEventListener('click', () => {
            const groupId = group.id;
            // Construct URL based on food group id
            const url = `food groups/mealkit.html`;
            // Navigate to the corresponding page
            window.location.href = url;
        });
    });

    const cantFindItemButton = document.querySelector('.cant-find-item-button');
    cantFindItemButton.addEventListener('click', function() {
        window.location.href = 'add-item.html'; // Redirect to the add-item.html page
    });

    const popup = document.getElementById('popup');
    popup.classList.add('show-popup');
});

async function handleSubmit(event) {
    event.preventDefault();
    const query = document.getElementById('search').value.trim();
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

function hidePopup() {
    const popup = document.getElementById('popup');
    popup.style.bottom = '-200px'; // Move the popup below the screen
}