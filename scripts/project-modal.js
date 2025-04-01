// Project Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const infoButtons = document.querySelectorAll('.project-btn.primary');
    
    // Project data - you would replace this with your actual project data
    const projectsData = [
        {
            title: "Advanced Task Manager",
            description: "<p>This task manager was built to help users organize their daily tasks with advanced features like categorization, priority levels, and due dates. The application includes data visualization to help users understand their productivity patterns.</p><p>The backend uses SQLite for data storage and PyQt5 for the graphical interface. The application supports multiple user profiles and can export reports in various formats.</p>",
            tags: ["Python", "PyQt5", "SQLite", "Data Visualization"],
            images: ["project1-1.jpg", "project1-2.jpg", "project1-3.jpg"],
            codeLink: "https://github.com/username/advanced-task-manager"
        },
        // Add more projects as needed
    ];

    // Open modal when Info button is clicked
    infoButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal(index);
        });
    });

    // Close modal when X button is clicked
    modalCloseBtn.addEventListener('click', closeProjectModal);

    // Close modal when clicking outside content
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    function openProjectModal(projectIndex) {
        const project = projectsData[projectIndex];
        
        // Set modal content
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectDescription').innerHTML = project.description;
        document.getElementById('modalProjectLink').href = project.codeLink;
        
        // Set tags
        const toolsBadges = document.querySelector('.tools-badges');
        toolsBadges.innerHTML = '';
        project.tags.forEach(tag => {
            const badge = document.createElement('span');
            badge.textContent = tag;
            toolsBadges.appendChild(badge);
        });
        
        // Set images
        const galleryMain = document.querySelector('.gallery-main img');
        const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        if (project.images.length > 0) {
            galleryMain.src = `images/${project.images[0]}`;
            
            project.images.forEach((image, idx) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail-item' + (idx === 0 ? ' active' : '');
                thumbnail.innerHTML = `<img src="images/${image}" alt="Thumbnail ${idx + 1}">`;
                
                thumbnail.addEventListener('click', () => {
                    // Update main image
                    galleryMain.src = `images/${image}`;
                    
                    // Update active thumbnail
                    document.querySelectorAll('.thumbnail-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    thumbnail.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
        }
        
        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});