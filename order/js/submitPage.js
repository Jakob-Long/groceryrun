document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const deliveryOptionInput = document.getElementById('deliveryOption');
    const itemCounts = {};

    slider.addEventListener('click', function () {
        slider.classList.toggle('clicked');
        if (slider.classList.contains('clicked')) {
            deliveryOptionInput.value = 'Pickup';
        } else {
            deliveryOptionInput.value = 'Delivery';
        }
    });

    // Retrieve submitted items from localStorage
    const submittedItemsJson = localStorage.getItem('cart');
    const submittedItems = JSON.parse(submittedItemsJson);

    // Retrieve selected date and time from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get('day');
    const time = urlParams.get('time');

    const deliveryForm = document.getElementById('deliveryForm');

    function createInputBoxes() {
        // Create an object to store aggregated items
        const aggregatedItems = {};
    
        // Aggregate items by name and brand
        submittedItems.forEach(item => {
            const key = `${item.name}-${item.brand}`;
            if (!aggregatedItems[key]) {
                aggregatedItems[key] = {
                    name: item.name,
                    brand: item.brand,
                    count: 1
                };
            } else {
                aggregatedItems[key].count += 1;
            }
        });

        // Create input boxes for aggregated items
        Object.values(aggregatedItems).forEach(item => {
            const inputSectionContainer = document.createElement('div');
    
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'Item_Name';
            inputName.value = item.name;
            inputName.readOnly = true;
            inputSectionContainer.appendChild(inputName);
    
            const inputBrand = document.createElement('input');
            inputBrand.type = 'text';
            inputBrand.name = 'Brand';
            inputBrand.value = item.brand;
            inputBrand.readOnly = true;
            inputSectionContainer.appendChild(inputBrand);
    
            inputSectionContainer.style.display = 'none';
    
            deliveryForm.appendChild(inputSectionContainer);
    
            const inputCount = document.createElement('input');
            inputCount.type = 'number';
            inputCount.name = 'Item_Count';
            inputCount.value = item.count;
            inputCount.readOnly = true;
            inputSectionContainer.appendChild(inputCount);
    
            inputSectionContainer.style.display = 'none';
    
            deliveryForm.appendChild(inputSectionContainer);
        });
    }    

    createInputBoxes();

    const inputDate = document.createElement('input');
    inputDate.type = 'hidden';
    inputDate.name = 'Day';
    console.log('Selected day:', day);
    inputDate.value = day;
    deliveryForm.appendChild(inputDate);

    const inputTime = document.createElement('input');
    inputTime.type = 'text';
    inputTime.name = 'Time';
    console.log('Selected time:', time);
    inputTime.value = time;
    inputTime.style.display = 'none';
    deliveryForm.appendChild(inputTime);

    window.submitDetails = function () {
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        localStorage.setItem('userDetails', JSON.stringify({
            name: name,
            address: address,
            phone: phone,
            email: email,
            submittedItems: submittedItems,
            deliveryDate: day,
            deliveryTime: time,
            deliveryOption: deliveryOptionInput.value // Add delivery/pickup option
        }));

        localStorage.removeItem('submittedItems');
    }; 
});

function openPaymentMethodDoc() {
    // Replace 'YOUR_GOOGLE_DOC_URL' with the actual URL of your Google Doc
    var googleDocUrl = 'https://docs.google.com/document/d/1XsQrTRGmNQfGs3PiLh7mwGuBR217Ovght19ISCUazC8/edit';
    
    // Open the Google Doc URL in a new tab
    window.open(googleDocUrl, '_blank');
}