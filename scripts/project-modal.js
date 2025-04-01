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
        {
            title: "Web Scraping Price Chart Generator",
            description: "<p>This tool automates the process of collecting price data from multiple e-commerce websites and generates comparative charts. It can track price history and alert users when prices drop below a certain threshold.</p><p>The tool uses BeautifulSoup and Selenium for web scraping and Matplotlib for generating visualizations. It can be configured to monitor any product URL and runs on a scheduled basis.</p>",
            tags: ["Python", "BeautifulSoup", "Selenium", "Matplotlib"],
            images: ["project2-1.jpg", "project2-2.jpg"],
            codeLink: "https://github.com/username/price-chart-generator"
        },
        {
            title: "Stock Price Tracker",
            description: "<p>A real-time stock price tracking application that provides customizable alerts and historical data visualization. Users can create watchlists and set price alerts for their favorite stocks.</p><p>The application connects to financial APIs to fetch real-time data and uses Tkinter for the user interface. It includes features like technical indicators and portfolio tracking.</p>",
            tags: ["Python", "Tkinter", "APIs", "Pandas"],
            images: ["project3-1.jpg", "project3-2.jpg", "project3-3.jpg"],
            codeLink: "https://github.com/username/stock-price-tracker"
        },
        {
            title: "Discord Trading Bot",
            description: "<p>This Discord bot provides real-time market data, trading signals, and portfolio management tools. It supports multiple cryptocurrency exchanges and can execute trades based on user-defined strategies.</p><p>The bot uses discord.py for the Discord integration and connects to exchange APIs for market data. It includes features like backtesting and paper trading.</p>",
            tags: ["Python", "Discord.py", "APIs", "Financial Analysis"],
            images: ["project4-1.jpg", "project4-2.jpg"],
            codeLink: "https://github.com/username/discord-trading-bot"
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
