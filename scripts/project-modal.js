// Project Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const infoButtons = document.querySelectorAll('.project-btn.primary');
    
    // Create elements for enlarged image viewer
    const enlargedViewer = document.createElement('div');
    enlargedViewer.className = 'enlarged-viewer';
    enlargedViewer.innerHTML = `
        <button class="enlarged-close-btn">✕</button>
        <div class="enlarged-image-container">
            <button class="nav-arrow prev-arrow">❮</button>
            <img class="enlarged-image" src="" alt="Enlarged project image">
            <button class="nav-arrow next-arrow">❯</button>
        </div>
    `;
    document.body.appendChild(enlargedViewer);
    
    // Project data - you would replace this with your actual project data
    // Project data - you would replace this with your actual project data
    const projectsData = [
        {
            title: "Discord Trading Bot",
            description: "<p>This Discord bot provides real-time market data, trading signals, and portfolio management tools. It supports multiple cryptocurrency exchanges and can execute paper trades based on user-defined strategies.</p><p>The bot uses discord.py for the Discord integration and connects to Binance API for market data. It includes features like backtesting and paper trading.</p>",
            tags: ["Python", "Discord.py", "APIs", "Financial Analysis"],
            images: ["discord-bot/!price.png", "discord-bot/!backtest.png", "discord-bot/!bothelp.png", "discord-bot/!signals.png","discord-bot/!about.png"],
            codeLink: "https://github.com/nextcodeworks/discord-trading-bot"
        },
        {
            title: "Advanced Task Manager",
            description: "<p>This task manager was built to help users organize their daily tasks with advanced features like categorization, priority levels, and due dates.</p><p>The backend uses SQLite for data storage and Tkinter for the graphical interface.</p>",
            tags: ["Python", "Tkinter", "SQLite", "Data Visualization"],
            images: ["task-manager.png"],
            codeLink: "https://github.com/nextcodeworks/task-manager"
        },
        {
            title: "Web Scraping Price Chart Generator",
            description: "<p>This tool automates the process of collecting price data from an e-commerce website and generates different types of charts.</p><p>The tool uses BeautifulSoup for web scraping and Matplotlib for generating visualizations and Tkinter for GUI. It can be configured to monitor any product URL.</p>",
            tags: ["Python", "BeautifulSoup", "Selenium", "Matplotlib"],
            images: ["price-chart-generator.png"],
            codeLink: "https://github.com/nextcodeworks/ecommerce-price-analyzer"
        },
        {
            title: "Stock Price Tracker",
            description: "<p>A real-time stock price tracking application that provides historical data visualization.</p><p>The application connects to financial APIs to fetch real-time data and uses Tkinter for the user interface. It includes features like technical indicators and stock data.</p>",
            tags: ["Python", "Tkinter", "APIs", "Pandas"],
            images: ["stock-price-tracker.png"],
            codeLink: "https://github.com/nextcodeworks/stock-price-tracker"
        },
        {
            title: "E-commerce Landing Page",
            description: "<p>A responsive, high-conversion landing page designed for an e-commerce store. The page includes product showcases, testimonials, and a streamlined checkout process.</p><p>Built with Next.js and TailwindCSS, the page is optimized for performance and SEO. It includes animations and interactive elements to engage visitors.</p>",
            tags: ["Next.js", "React", "TailwindCSS", "Responsive Design"],
            images: ["project5-1.jpg", "project5-2.jpg", "project5-3.jpg"],
            codeLink: "https://github.com/username/ecommerce-landing"
        },
        {
            title: "Data Analysis Dashboard",
            description: "<p>An interactive dashboard for visualizing and analyzing complex datasets. Users can upload their data and explore it through various chart types and filtering options.</p><p>The dashboard uses Python with Flask for the backend and D3.js for the visualizations. It supports CSV and Excel file uploads and can handle large datasets efficiently.</p>",
            tags: ["Python", "Flask", "Pandas", "D3.js"],
            images: ["project6-1.jpg", "project6-2.jpg"],
            codeLink: "https://github.com/username/data-dashboard"
        },
        {
            title: "Data Analysis Dashboard",
            description: "<p>An interactive dashboard for visualizing and analyzing complex datasets. Users can upload their data and explore it through various chart types and filtering options.</p><p>The dashboard uses Python with Flask for the backend and D3.js for the visualizations. It supports CSV and Excel file uploads and can handle large datasets efficiently.</p>",
            tags: ["Python", "Flask", "Pandas", "D3.js"],
            images: ["project6-1.jpg", "project6-2.jpg"],
            codeLink: "https://github.com/username/data-dashboard"
        },
        {
            title: "Data Analysis Dashboard",
            description: "<p>An interactive dashboard for visualizing and analyzing complex datasets. Users can upload their data and explore it through various chart types and filtering options.</p><p>The dashboard uses Python with Flask for the backend and D3.js for the visualizations. It supports CSV and Excel file uploads and can handle large datasets efficiently.</p>",
            tags: ["Python", "Flask", "Pandas", "D3.js"],
            images: ["project6-1.jpg", "project6-2.jpg"],
            codeLink: "https://github.com/username/data-dashboard"
        },
        // Add more projects as needed
    ];

    // Variables to track current image index
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    
    // Open modal when Info button is clicked
    infoButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentProjectIndex = index;
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
        if (e.key === 'Escape') {
            if (enlargedViewer.classList.contains('active')) {
                closeEnlargedView();
            } else if (projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        }
    });

    function openProjectModal(projectIndex) {
        const project = projectsData[projectIndex];
        currentImageIndex = 0;
        
        // Set modal content
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectDescription').innerHTML = project.description;

        // Set the link to open in new tab
        const codeLink = document.getElementById('modalProjectLink');
        codeLink.href = project.codeLink;
        
        // Set tags
        const toolsBadges = document.querySelector('.tools-badges');
        toolsBadges.innerHTML = '';
        project.tags.forEach(tag => {
            const badge = document.createElement('span');
            badge.textContent = tag;
            toolsBadges.appendChild(badge);
        });
        
        // Set images
        // Set images
        const galleryMain = document.querySelector('.gallery-main img');
        const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
        thumbnailsContainer.innerHTML = '';

        if (project.images.length > 0) {
            galleryMain.src = `images/${project.images[0]}`;
            galleryMain.alt = project.title;
            
            // Add click event to main image to enlarge it
            galleryMain.style.cursor = 'zoom-in';
            galleryMain.addEventListener('click', () => {
                openEnlargedView(projectIndex, currentImageIndex);
            });
            
            project.images.forEach((image, idx) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail-item' + (idx === 0 ? ' active' : '');
                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = `images/${image}`;
                thumbnailImg.alt = `Thumbnail ${idx + 1}`;
                thumbnail.appendChild(thumbnailImg);
                
                thumbnail.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Update main image
                    galleryMain.src = `images/${image}`;
                    currentImageIndex = idx;
                    
                    // Update active thumbnail
                    document.querySelectorAll('.thumbnail-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    thumbnail.classList.add('active');
                });
                
                // Remove the click event from thumbnail images (they should only update the main image)
                thumbnailImg.style.cursor = 'pointer';
                thumbnailImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Just update the main image, don't open enlarged view
                    galleryMain.src = `images/${image}`;
                    currentImageIndex = idx;
                    
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
    
    function openEnlargedView(projectIndex, imageIndex) {
        const project = projectsData[projectIndex];
        currentImageIndex = imageIndex;
        
        const enlargedImage = enlargedViewer.querySelector('.enlarged-image');
        enlargedImage.src = `images/${project.images[imageIndex]}`;
        enlargedImage.alt = project.title;
        
        enlargedViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeEnlargedView() {
        enlargedViewer.classList.remove('active');
        if (!projectModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Enlarged viewer navigation
    enlargedViewer.querySelector('.enlarged-close-btn').addEventListener('click', closeEnlargedView);
    
    enlargedViewer.querySelector('.prev-arrow').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });
    
    enlargedViewer.querySelector('.next-arrow').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });
    
    function navigateImage(direction) {
        const project = projectsData[currentProjectIndex];
        currentImageIndex += direction;
        
        // Wrap around if needed
        if (currentImageIndex < 0) {
            currentImageIndex = project.images.length - 1;
        } else if (currentImageIndex >= project.images.length) {
            currentImageIndex = 0;
        }
        
        const enlargedImage = enlargedViewer.querySelector('.enlarged-image');
        enlargedImage.src = `images/${project.images[currentImageIndex]}`;
    }

    // In the openProjectModal function, replace the code link section with:
    const codeLink = document.getElementById('modalProjectLink');
    if (project.codeLink) {
        codeLink.href = project.codeLink;
        codeLink.onclick = null; // Remove any existing click handlers
        codeLink.addEventListener('click', function(e) {
            // Let the default link behavior happen (open in new tab)
        });
    } else {
        codeLink.removeAttribute('href');
        codeLink.onclick = function(e) {
            e.preventDefault();
            // Optional: Show message that no code link is available
            alert('No code repository available for this project');
        };
    }
    
    // Keyboard navigation for enlarged view
    document.addEventListener('keydown', (e) => {
        if (enlargedViewer.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        }
    });
});
