// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('search-input');
  const searchQuery = searchInput.value.trim();
  
  if (searchQuery) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
    searchInput.value = ''; // Clear the input after search
  }
});

// Enable search on Enter key press
document.getElementById('search-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('search-button').click();
  }
});