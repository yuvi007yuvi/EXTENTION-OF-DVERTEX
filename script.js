// Theme Toggle Functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Voice Search Functionality
document.getElementById('voice-search').addEventListener('click', () => {
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

// Quick Links Functionality
document.querySelector('.add-quick-link').addEventListener('click', () => {
  const url = prompt('Enter URL for quick link:');
  const name = prompt('Enter name for quick link:');
  
  if (url && name) {
    const quickLink = document.createElement('a');
    quickLink.href = url;
    quickLink.className = 'quick-link';
    quickLink.textContent = name;
    
    document.getElementById('quick-links-container').appendChild(quickLink);
    
    // Save to localStorage
    const quickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');
    quickLinks.push({ url, name });
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
  }
});

// Load saved quick links
const savedQuickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');
savedQuickLinks.forEach(link => {
  const quickLink = document.createElement('a');
  quickLink.href = link.url;
  quickLink.className = 'quick-link';
  quickLink.textContent = link.name;
  document.getElementById('quick-links-container').appendChild(quickLink);
});