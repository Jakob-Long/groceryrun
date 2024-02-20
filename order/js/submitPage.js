document.addEventListener('DOMContentLoaded', function () {
    // Retrieve submitted items from localStorage
    const submittedItemsJson = localStorage.getItem('submittedItems');
    const submittedItems = JSON.parse(submittedItemsJson);

    // Now you can use submittedItems in your submitPage.html
    console.log(submittedItems);

    // Get the form element
    const deliveryForm = document.getElementById('deliveryForm');

    // Function to create and append input boxes for each submitted item
    function createInputBoxes() {
        submittedItems.forEach(item => {
            // Create a container div for each input section
            const inputSectionContainer = document.createElement('div');

            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'Item_Name';
            inputName.value = item.itemName;
            inputName.readOnly = true;
            inputSectionContainer.appendChild(inputName);

            const inputBrand = document.createElement('input');
            inputBrand.type = 'text';
            inputBrand.name = 'Brand';
            inputBrand.value = item.brand;
            inputBrand.readOnly = true;
            inputSectionContainer.appendChild(inputBrand);

            // Set the display property to "none" for the container div
            inputSectionContainer.style.display = 'none';

            // Append the container div to the form
            deliveryForm.appendChild(inputSectionContainer);
        });
    }

    // Call the function to create and append input boxes
    createInputBoxes();

    // Function to submit user details
    window.submitDetails = function () {
        // Get user details from the form
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validate the inputs (add your own validation logic here)

        // Save user details to localStorage
        localStorage.setItem('userDetails', JSON.stringify({
            name: name,
            address: address,
            phone: phone,
            email: email,
            submittedItems: submittedItems
        }));

        // Optionally, you can clear the submittedItems from localStorage after using it
        localStorage.removeItem('submittedItems');
    };

    // Rest of your submitPage.js logic...
});