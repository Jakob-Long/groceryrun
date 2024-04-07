document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const deliveryOptionInput = document.getElementById('deliveryOption');

    slider.addEventListener('click', function () {
        slider.classList.toggle('clicked');
        if (slider.classList.contains('clicked')) {
            deliveryOptionInput.value = 'Pickup';
        } else {
            deliveryOptionInput.value = 'Delivery';
        }
    });

    // Retrieve submitted items from localStorage
    const submittedItemsJson = localStorage.getItem('submittedItems');
    const submittedItems = JSON.parse(submittedItemsJson);

    // Retrieve selected date and time from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get('day');
    const time = urlParams.get('time');

    console.log(submittedItems);
    console.log(day);
    console.log(time);

    const deliveryForm = document.getElementById('deliveryForm');

    function createInputBoxes() {
        submittedItems.forEach(item => {
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

            inputSectionContainer.style.display = 'none';

            deliveryForm.appendChild(inputSectionContainer);

            const inputCount = document.createElement('input');
            inputCount.type = 'number';
            inputCount.name = 'Item_Count';
            inputCount.value = item.itemCount;
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