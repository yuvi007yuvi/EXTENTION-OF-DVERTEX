// Digital Clock Implementation
function updateDigitalClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  
  // Update date
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options).toUpperCase();
  
  // Update DOM
  document.querySelector('.time').textContent = timeString;
  document.querySelector('.date').textContent = dateString;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateDigitalClock();
  setInterval(updateDigitalClock, 1000);
});