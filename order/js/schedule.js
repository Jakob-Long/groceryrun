document.addEventListener("DOMContentLoaded", function() {
    fetch('days.json')
    .then(response => response.json())
    .then(data => {
        const today = new Date(); // Get current date
        const daysContainer = document.getElementById('days-container');
        const days = data.days;

        // Create button for each day
        days.forEach(day => {
            const button = document.createElement('button');
            button.textContent = day.name + " - " + day.date;
            button.addEventListener('click', function() {
                window.location.href = 'times.html?day=' + encodeURIComponent(day.name);
            });

            // Check if date has passed
            const dateParts = day.date.split('-');
            const dayDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            if (dayDate < today) {
                button.disabled = true; // Disable button if date has passed
                button.classList.add('disabled'); // Add a class for styling
            }

            daysContainer.appendChild(button);
        });
    })
    .catch(error => console.error('Error fetching schedule:', error));
});
