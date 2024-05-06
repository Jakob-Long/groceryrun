document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get('day');
    document.getElementById('day-heading').textContent = day;

    console.log(day);

    fetch('days.json')
    .then(response => response.json())
    .then(data => {
        const selectedDay = data.days.find(d => d.name === day);
        if (selectedDay) {
            const timesContainer = document.getElementById('times-container');
            const times = selectedDay.times;
            times.forEach(time => {
                const button = document.createElement('button');
                button.textContent = time;
                button.addEventListener('click', function() {
                    // Handle click event, e.g., add to cart, book, etc.
                    window.location.href = 'submitPage.html?day=' + encodeURIComponent(day) + '&time=' + encodeURIComponent(time);
                });
                timesContainer.appendChild(button);
            });
        } else {
            console.error('Day not found in schedule:', day);
        }
    })
    .catch(error => console.error('Error fetching schedule:', error));
});