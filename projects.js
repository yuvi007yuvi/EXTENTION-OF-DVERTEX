// Project Management Functionality
const projectsContainer = document.querySelector('.projects-container');
const addProjectButton = document.createElement('button');
addProjectButton.className = 'add-project-button';
addProjectButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
  Add Project
`;

// Add project button styles
addProjectButton.style.cssText = `
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--card-bg-color);
  border: 2px dashed var(--text-color);
  border-radius: 12px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  opacity: 0.7;
`;

// Project data structure
let projects = JSON.parse(localStorage.getItem('projects') || '[]');

// Create project card element
function createProjectCard(project) {
  const card = document.createElement('a');
  card.href = project.link || '#';
  card.target = '_blank';
  card.className = 'project-card';

  card.innerHTML = `
    <div class="project-icon">
      <img src="${project.icon || 'images/default-project.svg'}" alt="${project.title}">
    </div>
    <div class="project-info">
      <span class="project-title">${project.title}</span>
      <span class="project-description">${project.description}</span>
    </div>
    <button class="delete-project" onclick="deleteProject(event, ${projects.indexOf(project)})">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  return card;
}

// Delete project
window.deleteProject = (event, index) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (confirm('Are you sure you want to delete this project?')) {
    projects.splice(index, 1);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
  }
};

// Render all projects
function renderProjects() {
  projectsContainer.innerHTML = '';
  projects.forEach(project => {
    projectsContainer.appendChild(createProjectCard(project));
  });
  projectsContainer.appendChild(addProjectButton);
}

// Add project modal functionality
addProjectButton.addEventListener('click', () => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Project</h2>
      <form id="add-project-form">
        <div class="form-group">
          <label for="project-title">Project Title</label>
          <input type="text" id="project-title" required>
        </div>
        <div class="form-group">
          <label for="project-description">Description</label>
          <textarea id="project-description" required></textarea>
        </div>
        <div class="form-group">
          <label for="project-link">Project Link</label>
          <input type="url" id="project-link" placeholder="https://example.com">
        </div>
        <div class="form-group">
          <label for="project-icon">Icon URL</label>
          <input type="url" id="project-icon" placeholder="https://example.com/icon.svg">
        </div>
        <div class="modal-buttons">
          <button type="button" class="cancel-btn">Cancel</button>
          <button type="submit" class="submit-btn">Add Project</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal on cancel
  modal.querySelector('.cancel-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Handle form submission
  modal.querySelector('#add-project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProject = {
      title: document.getElementById('project-title').value,
      description: document.getElementById('project-description').value,
      link: document.getElementById('project-link').value,
      icon: document.getElementById('project-icon').value || 'images/default-project.svg'
    };

    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
    document.body.removeChild(modal);
  });
});

// Initial render
document.addEventListener('DOMContentLoaded', renderProjects);