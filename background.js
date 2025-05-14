// Mini Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('mini-sidebar');
  const toggleBtn = document.getElementById('toggle-sidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Smooth scroll for quick links
  document.querySelectorAll('.quick-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.querySelector(`[id^="${targetId}"]`) || 
                            document.querySelector(`[class*="${targetId}"]`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});