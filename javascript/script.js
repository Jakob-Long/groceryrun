// Set the date and time for the countdown
const countDownDate = new Date("2023-12-02T12:00:00").getTime();

// Update the countdown every second
const timer = setInterval(function() {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  // Calculate remaining time
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the countdown
  document.getElementById("timer").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  // If the countdown is finished, display a message
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);

// Set the date and time for the calendar event
const eventStartDate = new Date("2023-12-02T12:00:00");
const eventEndDate = new Date("2023-12-02T14:00:00");
const eventName = 'Grocery Run Launch Event';
const eventLocation = 'Event Location';
const eventDescription = 'Make money from your groceries';

function createICSFileContent() {
  const startTime = eventStartDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endTime = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');

  const calendarContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${startTime}
DTSTAMP:${startTime}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${eventName}
LOCATION:${eventLocation}
DESCRIPTION:${eventDescription}
END:VEVENT
END:VCALENDAR`;

  return calendarContent;
}

function createGoogleCalendarLink() {
  const startTime = eventStartDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
  const endTime = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);

  const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

  return googleCalendarLink;
}

// Get the buttons for adding to calendar
const icsButton = document.getElementById('icsButton');
const googleCalendarButton = document.getElementById('googleCalendarButton');

// When clicked, create the .ics file and allow users to download it
icsButton.addEventListener('click', function() {
  const icsContent = createICSFileContent();
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'event.ics';
  a.click();
});

// When clicked, redirect users to create a Google Calendar event
googleCalendarButton.addEventListener('click', function() {
  const calendarURL = createGoogleCalendarLink();
  window.open(calendarURL);
});
