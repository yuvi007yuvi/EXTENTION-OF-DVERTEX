// DVERTEX INFO SYSTEM - Main Script

// AI Tool URLs
const AI_TOOLS = {
    chatgpt: 'https://chat.openai.com',
    deepseek: 'https://chat.deepseek.com',
    bard: 'https://bard.google.com',
    claude: 'https://claude.ai'
};

// Initialize AI Tools Section
function initAITools() {
    const aiToolsContainer = document.querySelector('.ai-tools-container');
    if (!aiToolsContainer) return;

    // Create AI Tool Buttons
    Object.entries(AI_TOOLS).forEach(([tool, url]) => {
        const button = document.createElement('a');
        button.href = url;
        button.className = `ai-tool-button ${tool}`;
        button.target = '_blank'; // Open in new tab
        button.rel = 'noopener noreferrer'; // Security best practice

        const icon = document.createElement('img');
        icon.className = 'ai-tool-icon';
        icon.src = `assets/icons/${tool}.svg`;
        icon.alt = `${tool} icon`;

        const title = document.createElement('span');
        title.className = 'ai-tool-title';
        title.textContent = tool.charAt(0).toUpperCase() + tool.slice(1); // Capitalize first letter

        button.appendChild(icon);
        button.appendChild(title);

        // Add click event with visual feedback
        button.addEventListener('click', (e) => {
            // Add a brief scale effect on click
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });

        aiToolsContainer.appendChild(button);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initSearch();
  initTasks();
  initNotes();
  initBookmarks();
  initAITools();
  initQuickLinksPopup();
  
  // Set greeting based on time of day
  setGreeting();
});

// DOM Elements
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const resetBgButton = document.getElementById('reset-bg');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Default values
const DEFAULT_BG_COLOR = '#121212';

// Load saved settings
function loadSavedSettings() {
    const savedBgColor = localStorage.getItem('bgColor') || DEFAULT_BG_COLOR;
    const savedBgImage = localStorage.getItem('bgImage');

    bgColorInput.value = savedBgColor;
    document.body.style.backgroundColor = savedBgColor;

    if (savedBgImage) {
        document.body.style.backgroundImage = `url(${savedBgImage})`;
    }
}

// Settings panel toggle
settingsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('active');
});

// Close settings panel when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
        settingsPanel.classList.remove('active');
    }
});



// Background color change
bgColorInput.addEventListener('input', (e) => {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('bgColor', color);
});

// Background image upload
bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.body.style.backgroundImage = `url(${imageUrl})`;
            localStorage.setItem('bgImage', imageUrl);
        };
        reader.readAsDataURL(file);
    }
});

// Reset background
resetBgButton.addEventListener('click', () => {
    document.body.style.backgroundColor = DEFAULT_BG_COLOR;
    document.body.style.backgroundImage = 'none';
    bgColorInput.value = DEFAULT_BG_COLOR;
    bgImageInput.value = '';
    localStorage.removeItem('bgImage');
    localStorage.setItem('bgColor', DEFAULT_BG_COLOR);
});

// Initialize settings
loadSavedSettings();



// Initialize Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Remove duplicate quick-link form
// Initialize Quick Links Popup
function initQuickLinksPopup() {
    const quickLinks = document.querySelectorAll('.bookmark-item:not(.add-bookmark)');
    const popup = document.createElement('div');
    popup.className = 'quick-link-popup';
    popup.innerHTML = `
        <h2>Add Quick Link</h2>
        <form id="quick-link-form">
            <label for="link-name">Link Name</label>
            <input type="text" id="link-name" required>
            
            <label for="link-url">URL</label>
            <input type="url" id="link-url" required>
            
            <label for="link-description">Description</label>
            <textarea id="link-description"></textarea>
            
            <div class="quick-link-popup-buttons">
                <button type="submit" class="primary">Save</button>
                <button type="button" class="secondary" id="cancel-popup">Cancel</button>
            </div>
        </form>
    `;
    
    if (!document.querySelector('.quick-link-popup')) {
        document.body.appendChild(popup);
    }
    
    const cancelBtn = document.getElementById('cancel-popup');
    cancelBtn.addEventListener('click', () => {
        popup.classList.remove('active');
    });
    
    // Handle form submission
    const quickLinkForm = document.getElementById('quick-link-form');
    quickLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('link-name').value.trim();
        const url = document.getElementById('link-url').value.trim();
        const description = document.getElementById('link-description').value.trim();
        
        if (name && url) {
            try {
                new URL(url);
                saveQuickLink(name, url, description);
                popup.classList.remove('active');
                quickLinkForm.reset();
            } catch (e) {
                alert('Please enter a valid URL (e.g. https://example.com)');
            }
        } else {
            alert('Please fill in both name and URL fields');
        }
    });
    
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            popup.classList.add('active');
        });
    });
}

// Save quick link to localStorage
function saveQuickLink(name, url, description = '') {
    const quickLinks = getQuickLinks();
    quickLinks.push({name, url, description});
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
    renderQuickLinks();
}

// Get quick links from localStorage
function getQuickLinks() {
    return JSON.parse(localStorage.getItem('quickLinks')) || [];
}

// Render quick links to the UI
function renderQuickLinks() {
    const quickLinksContainer = document.getElementById('quick-links-container');
    if (!quickLinksContainer) return;
    
    quickLinksContainer.innerHTML = '';
    const links = getQuickLinks();
    
    if (links.length === 0) {
        quickLinksContainer.innerHTML = '<p>No quick links added yet</p>';
        return;
    }
    
    links.forEach(link => {
        const linkElement = document.createElement('div');
        linkElement.className = 'quick-link-item';
        linkElement.innerHTML = `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                <h3>${link.name}</h3>
                ${link.description ? `<p>${link.description}</p>` : ''}
            </a>
            <button class="delete-quick-link">×</button>
        `;
        
        linkElement.querySelector('.delete-quick-link').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteQuickLink(link.url);
        });
        
        quickLinksContainer.appendChild(linkElement);
    });
}

// Delete quick link
function deleteQuickLink(url) {
    const quickLinks = getQuickLinks().filter(link => link.url !== url);
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
    renderQuickLinks();
}

// Search functionality
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Tasks functionality
function initTasks() {
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  
  // Load saved tasks
  loadTasks();
  
  addTaskButton.addEventListener('click', function() {
    addTask();
  });
  
  taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
      const tasks = getTasks();
      tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
      });
      
      saveTasks(tasks);
      renderTasks();
      taskInput.value = '';
    }
  }
  
  function renderTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'No tasks yet. Add one above!';
      emptyMessage.style.color = 'var(--text-secondary)';
      emptyMessage.style.fontStyle = 'italic';
      taskList.appendChild(emptyMessage);
      return;
    }
    
    tasks.forEach(function(task) {
      const li = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', function() {
        toggleTaskComplete(task.id);
      });
      
      const span = document.createElement('span');
      span.textContent = task.text;
      if (task.completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = 'var(--text-secondary)';
      }
      
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Delete task';
      deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
      });
      
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
  
  function toggleTaskComplete(id) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks(tasks);
      renderTasks();
    }
  }
  
  function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    renderTasks();
  }
  
  function getTasks() {
    const tasksJson = localStorage.getItem('dvertex_tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  }
  
  function saveTasks(tasks) {
    localStorage.setItem('dvertex_tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    renderTasks();
  }
}

// Notes functionality
function initNotes() {
  const notesArea = document.getElementById('notes-area');
  const saveNotesButton = document.getElementById('save-notes');
  
  // Load saved notes
  loadNotes();
  
  saveNotesButton.addEventListener('click', function() {
    saveNotes();
  });
  
  function saveNotes() {
    const notesText = notesArea.value;
    localStorage.setItem('dvertex_notes', notesText);
    
    // Show save confirmation
    const originalText = saveNotesButton.textContent;
    saveNotesButton.textContent = 'Saved!';
    saveNotesButton.style.background = 'var(--success-color)';
    
    setTimeout(function() {
      saveNotesButton.textContent = originalText;
      saveNotesButton.style.background = 'var(--warning-color)';
    }, 1500);
  }
  
  function loadNotes() {
    const savedNotes = localStorage.getItem('dvertex_notes');
    if (savedNotes) {
      notesArea.value = savedNotes;
    }
  }
}

// Enhanced Quick Links functionality
function initBookmarks() {
  const bookmarkGrid = document.getElementById('bookmark-grid');
  if (!bookmarkGrid) return;
  
  const defaultBookmarks = [
    { title: 'Google', url: 'https://www.google.com', icon: 'G', category: 'search' },
    { title: 'YouTube', url: 'https://www.youtube.com', icon: 'Y', category: 'media' },
    { title: 'Gmail', url: 'https://mail.google.com', icon: 'M', category: 'productivity' },
    { title: 'Maps', url: 'https://maps.google.com', icon: 'M', category: 'navigation' },
    { title: 'Drive', url: 'https://drive.google.com', icon: 'D', category: 'storage' }
  ];
  
  // Enhanced bookmark rendering with categories
  function renderBookmarks(bookmarks) {
    bookmarkGrid.innerHTML = '';
    
    // Group by category
    const categories = {};
    bookmarks.forEach(bookmark => {
      if (!categories[bookmark.category]) {
        categories[bookmark.category] = [];
      }
      categories[bookmark.category].push(bookmark);
    });
    
    // Create category sections
    Object.entries(categories).forEach(([category, bookmarks]) => {
      const section = document.createElement('div');
      section.className = 'bookmark-category';
      
      const heading = document.createElement('h3');
      heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      section.appendChild(heading);
      
      const grid = document.createElement('div');
      grid.className = 'bookmark-items';
      
      bookmarks.forEach(bookmark => {
        const item = document.createElement('a');
        item.href = bookmark.url;
        item.className = 'bookmark-item';
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        
        const icon = document.createElement('div');
        icon.className = 'bookmark-icon';
        icon.textContent = bookmark.icon;
        
        const title = document.createElement('span');
        title.className = 'bookmark-title';
        title.textContent = bookmark.title;
        
        item.appendChild(icon);
        item.appendChild(title);
        grid.appendChild(item);
      });
      
      section.appendChild(grid);
      bookmarkGrid.appendChild(section);
    });
  }
  
  // Load saved bookmarks
  loadBookmarks();

  // Bookmark management functions
  function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : defaultBookmarks;
    renderBookmarks(bookmarks);
  }

  function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks(bookmarks);
  }

  function addBookmark(title, url, category, icon) {
    const bookmarks = getBookmarks();
    bookmarks.push({ title, url, category, icon });
    saveBookmarks(bookmarks);
  }

  function removeBookmark(index) {
    const bookmarks = getBookmarks();
    bookmarks.splice(index, 1);
    saveBookmarks(bookmarks);
  }

  function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks')) || defaultBookmarks;
  }

  // Initialize add bookmark button
  const addBookmarkBtn = document.getElementById('add-bookmark');
  if (addBookmarkBtn) {
    addBookmarkBtn.addEventListener('click', showAddBookmarkModal);
  }
  
  // Add bookmark button functionality
  const addBookmarkButton = document.querySelector('.add-bookmark');
  addBookmarkButton.addEventListener('click', function() {
    showAddBookmarkDialog();
  });
  
  function showAddBookmarkDialog() {
    // Create popup modal
    const modal = document.createElement('div');
    modal.className = 'bookmark-modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Add New Quick Link</h3>
        <div class="input-group">
          <label for="bookmark-title">Title</label>
          <input type="text" id="bookmark-title" placeholder="Enter link title">
        </div>
        <div class="input-group">
          <label for="bookmark-url">URL</label>
          <input type="text" id="bookmark-url" placeholder="https://example.com">
        </div>
        <div class="input-group">
          <label for="bookmark-category">Category</label>
          <select id="bookmark-category">
            <option value="search">Search</option>
            <option value="media">Media</option>
            <option value="productivity">Productivity</option>
            <option value="navigation">Navigation</option>
            <option value="storage">Storage</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="input-group">
          <label for="bookmark-icon">Icon (single character)</label>
          <input type="text" id="bookmark-icon" maxlength="1" placeholder="e.g. G">
        </div>
        <div class="modal-buttons">
          <button id="cancel-bookmark">Cancel</button>
          <button id="save-bookmark">Save</button>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('cancel-bookmark').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('save-bookmark').addEventListener('click', () => {
      const title = document.getElementById('bookmark-title').value.trim();
      const url = document.getElementById('bookmark-url').value.trim();
      
      if (title && url) {
        // Validate URL format
        try {
          new URL(url);
          addBookmark(title, url);
          document.body.removeChild(modal);
        } catch (e) {
          alert('Please enter a valid URL (e.g. https://example.com)');
        }
      } else {
        alert('Please fill in both title and URL');
      }
    });
  }
  
  function addBookmark(title, url, category, icon) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const bookmarks = getBookmarks();
    bookmarks.push({
      title: title,
      url: url,
      category: category || 'other',
      icon: icon || title.charAt(0).toUpperCase()
    });
    
    saveBookmarks(bookmarks);
    renderBookmarks(bookmarks);
  }
  
  function renderBookmarks() {
    const bookmarks = getBookmarks();
    const bookmarkGrid = document.querySelector('.bookmark-grid');
    
    if (!bookmarkGrid) return;
    
    // Clear current bookmarks except the add button
    while (bookmarkGrid.firstChild) {
      bookmarkGrid.removeChild(bookmarkGrid.firstChild);
    }
    
    // Add bookmarks
    bookmarks.forEach(function(bookmark) {
      const bookmarkItem = document.createElement('div');
      bookmarkItem.className = 'bookmark-item';
      
      const bookmarkIcon = document.createElement('div');
      bookmarkIcon.className = 'bookmark-icon';
      bookmarkIcon.textContent = bookmark.icon;
      
      const bookmarkTitle = document.createElement('div');
      bookmarkTitle.className = 'bookmark-title';
      bookmarkTitle.textContent = bookmark.title;
      bookmarkTitle.title = bookmark.title;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'bookmark-delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Delete bookmark';
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteBookmark(bookmark.url);
      });
      
      bookmarkItem.appendChild(bookmarkIcon);
      bookmarkItem.appendChild(bookmarkTitle);
      bookmarkItem.appendChild(deleteBtn);
      bookmarkItem.addEventListener('click', function() {
        window.open(bookmark.url, '_blank');
      });
      bookmarkGrid.appendChild(bookmarkItem);
    });
    
    // Add the 'Add New' button back
    const addBookmarkItem = document.createElement('div');
    addBookmarkItem.className = 'bookmark-item add-bookmark';
    addBookmarkItem.addEventListener('click', function() {
      showAddBookmarkDialog();
    });
    
    const addBookmarkIcon = document.createElement('div');
    addBookmarkIcon.className = 'bookmark-icon';
    addBookmarkIcon.textContent = '+';
    
    const addBookmarkTitle = document.createElement('div');
    addBookmarkTitle.className = 'bookmark-title';
    addBookmarkTitle.textContent = 'Add New';
    
    addBookmarkItem.appendChild(addBookmarkIcon);
    addBookmarkItem.appendChild(addBookmarkTitle);
    bookmarkGrid.appendChild(addBookmarkItem);
  }
  
  function getBookmarks() {
    const bookmarksJson = localStorage.getItem('dvertex_bookmarks');
    return bookmarksJson ? JSON.parse(bookmarksJson) : defaultBookmarks;
  }
  
  function saveBookmarks(bookmarks) {
    localStorage.setItem('dvertex_bookmarks', JSON.stringify(bookmarks));
  }
  
  function deleteBookmark(url) {
    const bookmarks = getBookmarks().filter(bookmark => bookmark.url !== url);
    saveBookmarks(bookmarks);
    renderBookmarks();
  }
  
  function loadBookmarks() {
    const bookmarkGrid = document.querySelector('.bookmark-grid');
    if (bookmarkGrid) {
      renderBookmarks();
    }
  }
}

// Set greeting based on time of day
function setGreeting() {
  const header = document.querySelector('header');
  const now = new Date();
  const hour = now.getHours();
  let greeting;
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  // Create greeting element if it doesn't exist
  if (!document.querySelector('.greeting')) {
    const greetingElement = document.createElement('div');
    greetingElement.className = 'greeting';
    greetingElement.style.fontSize = '18px';
    greetingElement.style.fontWeight = '500';
    greetingElement.style.color = 'var(--text-secondary)';
    greetingElement.style.marginTop = '10px';
    greetingElement.style.textAlign = 'center';
    greetingElement.textContent = `${greeting}! Welcome to DVERTEX INFO SYSTEM`;
    
    header.appendChild(greetingElement);
  }
}