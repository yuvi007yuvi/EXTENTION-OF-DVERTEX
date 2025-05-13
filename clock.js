// Analog Clock Implementation
function setupAnalogClock() {
  const clockFace = document.createElement('div');
  clockFace.className = 'clock-face';
  
  const hourHand = document.createElement('div');
  hourHand.className = 'clock-hand hour-hand';
  
  const minuteHand = document.createElement('div');
  minuteHand.className = 'clock-hand minute-hand';
  
  const secondHand = document.createElement('div');
  secondHand.className = 'clock-hand second-hand';
  
  const clockCenter = document.createElement('div');
  clockCenter.className = 'clock-center';
  
  clockFace.append(hourHand, minuteHand, secondHand, clockCenter);
  
  const analogClock = document.createElement('div');
  analogClock.className = 'analog-clock';
  analogClock.appendChild(clockFace);
  
  // Find the digital clock container and insert analog clock next to it
  const timeContainer = document.querySelector('.time-container');
  if (timeContainer) {
    timeContainer.insertAdjacentElement('afterbegin', analogClock);
  }
  
  function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
    
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
  }
  
  // Update immediately and then every second
  updateClock();
  setInterval(updateClock, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupAnalogClock);