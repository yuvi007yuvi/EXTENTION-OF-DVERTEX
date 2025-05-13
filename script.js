// Digital Clock Functionality
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' }).toUpperCase();
  
  document.querySelector('.digital-clock .time').textContent = time;
  document.querySelector('.digital-clock .date').textContent = date;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Voice Search Functionality
const voiceSearch = document.getElementById('voice-search');
if (voiceSearch) {
  voiceSearch.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('search-input').value = transcript;
    };
    
    recognition.start();
  });
}

// Quick Links Functionality
function createQuickLinkElement(url, name, index) {
  const linkContainer = document.createElement('div');
  linkContainer.className = 'quick-link-container';

  const quickLink = document.createElement('a');
  quickLink.href = url;
  quickLink.className = 'quick-link';
  quickLink.textContent = name;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-link';
  deleteButton.innerHTML = '×';
  deleteButton.onclick = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this link?')) {
      const quickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');
      quickLinks.splice(index, 1);
      localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
      linkContainer.remove();
    }
  };

  linkContainer.appendChild(quickLink);
  linkContainer.appendChild(deleteButton);
  return linkContainer;
}

const addQuickLink = document.querySelector('.add-quick-link');
if (addQuickLink) {
  addQuickLink.addEventListener('click', () => {
    const url = prompt('Enter URL for quick link:');
    const name = prompt('Enter name for quick link:');
    
    if (url && name) {
      const quickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');
      quickLinks.push({ url, name });
      localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
      
      const linkElement = createQuickLinkElement(url, name, quickLinks.length - 1);
      document.getElementById('quick-links-container').appendChild(linkElement);
    }
  });
}

// Load saved quick links
const savedQuickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');
const quickLinksContainer = document.getElementById('quick-links-container');
if (quickLinksContainer) {
  savedQuickLinks.forEach((link, index) => {
    const linkElement = createQuickLinkElement(link.url, link.name, index);
    quickLinksContainer.appendChild(linkElement);
  });
}