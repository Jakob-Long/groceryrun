document.addEventListener('DOMContentLoaded', function () {
    const addNewItemBtn = document.getElementById('addNewItemBtn');
    const inputSectionsContainer = document.getElementById('inputSectionsContainer');
    const submitOrderBtn = document.getElementById('submitOrderBtn');

    addNewItemBtn.addEventListener('click', function () {
        // Clone the existing input section
        const inputSection = document.querySelector('.input-section');
        const newInputSection = inputSection.cloneNode(true);

        // Clear input values in the cloned section
        newInputSection.querySelectorAll('input').forEach(input => {
            input.value = '';
        });

        // Append the cloned section to the input sections container
        inputSectionsContainer.appendChild(newInputSection);
    });

    submitOrderBtn.addEventListener('click', function () {
        // Collect item details from input sections
        const inputSections = document.querySelectorAll('.input-section');
        const submittedItems = [];

        inputSections.forEach(section => {
            const itemName = section.querySelector('#itemName').value.trim();
            const brand = section.querySelector('#brand').value.trim();

            if (itemName !== '' || brand !== '') {
                submittedItems.push({
                    itemName: itemName,
                    brand: brand
                });
            }
        });

        // Save submitted items to localStorage
        localStorage.setItem('submittedItems', JSON.stringify(submittedItems));

        // Redirect to the submitPage.html
        window.location.href = 'schedule.html';
    });
});

function deleteItem(button) {
    // Get the parent node (input section) and remove it
    const inputSection = button.parentNode;
    inputSection.parentNode.removeChild(inputSection);
}