// scripts/price-estimator.js

// Initialize features after the price estimator is fully loaded
function initializePriceEstimator() {
    // Wait for the next tick to ensure the DOM is fully updated
    setTimeout(() => {
        // Initialize features
        initializeFeatures();
        
        // Initialize price calculation
        calculateDiscordBotPrice();
        
        // Add event listeners for form inputs that affect price
        const formInputs = document.querySelectorAll('input[type="number"], input[type="range"], select');
        formInputs.forEach(input => {
            input.addEventListener('change', calculateDiscordBotPrice);
            input.addEventListener('input', calculateDiscordBotPrice);
        });
    }, 100);
}

// Function to sync heights of API integrations and extras sections
function syncSectionHeights() {
    const gridContainers = document.querySelectorAll('.price-estimator-form-group > div[style*="grid-template-columns"]');
    
    gridContainers.forEach(container => {
        const leftSide = container.querySelector('.price-estimator-input-group');
        const rightSide = Array.from(container.children).find(el => !el.classList.contains('price-estimator-input-group'));
        
        if (leftSide && rightSide) {
            const leftHeight = leftSide.offsetHeight;
            rightSide.style.minHeight = `${leftHeight}px`;
        }
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePriceEstimator();
    
    // Sync heights after content loads
    setTimeout(syncSectionHeights, 100);
    
    // Also sync on window resize
    window.addEventListener('resize', syncSectionHeights);
});

// Calculate the total price for the Discord bot
function calculateDiscordBotPrice() {
    let totalPrice = 0;
    
    // Get the selected bot type
    const botTypeSelect = document.getElementById('bot-type');
    const botType = botTypeSelect ? botTypeSelect.value : 'standard';
    
    // Add base price based on bot type
    totalPrice += PRICING_CONFIG.discordBot.basePrice[botType] || 0;
    
    // Add price for slash commands
    const slashCommands = parseInt(document.getElementById('slash-commands-slider')?.value || 0);
    totalPrice += slashCommands * PRICING_CONFIG.discordBot.slashCommandPrice;
    
    // Add price for message commands
    const messageCommands = parseInt(document.getElementById('message-commands-slider')?.value || 0);
    totalPrice += messageCommands * PRICING_CONFIG.discordBot.messageCommandPrice;
    
    // Add price for selected features
    const selectedFeatures = document.querySelectorAll('.price-estimator-feature-item input[type="checkbox"]:checked');
    selectedFeatures.forEach(checkbox => {
        const featurePrice = parseInt(checkbox.getAttribute('data-price') || '0');
        totalPrice += featurePrice;
    });
    
    // Apply complexity multiplier based on bot type
    totalPrice *= PRICING_CONFIG.discordBot.complexityMultiplier[botType] || 1;
    
    // Update the displayed price
    const priceElement = document.getElementById('estimated-price');
    if (priceElement) {
        priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    return totalPrice;
}

// Initialize feature checkboxes and tooltips
function initializeFeatures() {
    console.log('Initializing features...');
    const features = PRICING_CONFIG.discordBot.features;
    
    // Log the features to check if they're loaded
    console.log('Features from config:', features);
    
    // Check if we have any category containers
    const categoryContainers = document.querySelectorAll('.price-estimator-features-grid');
    console.log(`Found ${categoryContainers.length} category containers`);
    
    // Log all category containers and their data-category attributes
    categoryContainers.forEach(container => {
        console.log('Container category:', container.getAttribute('data-category'));
    });
    
    // Create a mapping of feature categories to their display names
    const categoryMap = {
        'core': 'core',
        'moderation': 'moderation',
        'community': 'community',
        'utility': 'utility',
        'advanced': 'advanced',
        'integration': 'integration'
    };
    
    // Create feature checkboxes for each category
    Object.entries(features).forEach(([key, feature]) => {
        // Map the feature category to the correct container
        const category = categoryMap[feature.category] || feature.category;
        const categoryContainer = document.querySelector(`.price-estimator-features-grid[data-category="${category}"]`);
        
        console.log(`Processing feature: ${key}, original category: ${feature.category}, mapped to: ${category}, container found: ${!!categoryContainer}`);
        
        if (!categoryContainer) {
            console.warn(`No container found for category: ${feature.category} (mapped to: ${category})`);
            return;
        }
        
        const featureId = `feature-${key}`;
        const featureItem = document.createElement('div');
        featureItem.className = 'price-estimator-feature-item';
        featureItem.innerHTML = `
            <input type="checkbox" id="${featureId}" data-price="${feature.price}" data-feature="${key}">
            <label for="${featureId}" class="feature-label">
                <span class="feature-name">${formatFeatureName(key)}</span>
            </label>
            <button class="feature-info-btn" 
                    data-description="${feature.description.replace(/"/g, '&quot;')}" 
                    data-name="${formatFeatureName(key)}"
                    ${feature.image ? `data-image="${feature.image}"` : ''}>
                <span class="feature-info-icon">i</span>
            </button>
            <span class="price-estimator-feature-price">+$${feature.price}</span>
        `;
        
        // Add event listener for price calculation
        const checkbox = featureItem.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                calculateDiscordBotPrice();
            });
        }
        
        // Add click handler for info buttons
        const infoBtn = featureItem.querySelector('.feature-info-btn');
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const description = infoBtn.getAttribute('data-description');
                const name = infoBtn.getAttribute('data-name');
                
                // Create or update modal
                let modal = document.getElementById('feature-description-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'feature-description-modal';
                    modal.className = 'feature-description-modal';
                    modal.innerHTML = `
                        <div class="feature-description-content">
                            <button class="close-feature-modal">&times;</button>
                            <h3 class="feature-modal-title"></h3>
                            <div class="feature-modal-image-container"></div>
                            <div class="feature-modal-description"></div>
                        </div>
                        <div id="fullscreen-image-viewer" class="fullscreen-image-viewer">
                            <img id="fullscreen-image" src="" alt="Fullscreen image">
                        </div>
                    `;
                    document.body.appendChild(modal);
                    
                    // Add close button handler
                    const closeBtn = modal.querySelector('.close-feature-modal');
                    closeBtn.addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                    
                    // Close when clicking outside the modal
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });
                }
                
                // Update modal content and show
                modal.querySelector('.feature-modal-title').textContent = name;
                modal.querySelector('.feature-modal-description').textContent = description;
                
                // Handle image if provided
                const imageContainer = modal.querySelector('.feature-modal-image-container');
                const imageUrl = infoBtn.getAttribute('data-image');
                const fullscreenViewer = document.getElementById('fullscreen-image-viewer');
                const fullscreenImage = document.getElementById('fullscreen-image');
                
                if (imageUrl) {
                    const img = new Image();
                    img.src = imageUrl;
                    img.alt = `${name} example`;
                    img.className = 'feature-modal-image';
                    
                    // Clear previous image and add new one
                    imageContainer.innerHTML = '';
                    imageContainer.appendChild(img);
                    imageContainer.style.display = 'block';
                    
                    // Add click handler for fullscreen
                    img.addEventListener('click', (e) => {
                        e.stopPropagation();
                        fullscreenImage.src = imageUrl;
                        fullscreenViewer.classList.add('active');
                    });
                } else {
                    imageContainer.innerHTML = '';
                    imageContainer.style.display = 'none';
                }
                
                // Close fullscreen when clicking outside the image
                fullscreenViewer.addEventListener('click', (e) => {
                    if (e.target === fullscreenViewer) {
                        fullscreenViewer.classList.remove('active');
                    }
                });
                
                // Close fullscreen with escape key
                document.addEventListener('keydown', function handleEscape(e) {
                    if (e.key === 'Escape' && fullscreenViewer.classList.contains('active')) {
                        fullscreenViewer.classList.remove('active');
                    }
                });
                modal.style.display = 'flex';
            });
        }
        
        categoryContainer.appendChild(featureItem);
        console.log(`Added feature ${key} to category ${category}`);
    });
    
    console.log('Feature initialization complete');
}

// Helper function to format feature names (convert camelCase to Title Case)
function formatFeatureName(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Pricing configuration
const PRICING_CONFIG = {
    discordBot: {
        basePrice: {
            basic: 50,
            standard: 100,
            premium: 200
        },
        complexityMultiplier: {
            basic: 1.0,
            standard: 1.5,
            premium: 2.0
        },
        slashCommandPrice: 10,
        messageCommandPrice: 5,
        features: {
            // Core Interaction Features
            buttons: { price: 15, category: 'core', description: 'Interactive buttons for user interaction', image: 'https://docs.midjourney.com/hc/article_attachments/32872364395917' },
            modals: { price: 20, category: 'core', description: 'For collecting multi-field input like feedback, sign-ups, or reports', image: 'https://discordjs.guide/assets/modal-example.1a91ffff.png' },
            logs: { price: 25, category: 'core', description: 'Sending log details into a specified channel', image: 'https://docs.bulbbot.rocks/assets/images/Mod_Logs-ea62e0d76a288087e643e8f3ef720339.png' },
            
            // Moderation & Management
            roleManagement: { price: 35, category: 'moderation', description: 'Auto-assign roles, sync with external systems, enforce access controls' },
            moderationTools: { price: 55, category: 'moderation', description: 'Moderation commands, such as ban, kick, mute, warn, etc.' },
            autoMod: { price: 45, category: 'moderation', description: 'Flag content (bad words, spam, links), mute/ban offenders, auto-warn escalation', image: 'https://user-images.githubusercontent.com/45244473/196917527-cff86e16-f074-493d-8067-a85c0599c102.png' },
            antiRaid: { price: 55, category: 'moderation', description: 'Monitor join activity, block spammers/bots, rate-limit behaviors' },
            adminPanel: { price: 55, category: 'moderation', description: 'Admin panel for adding/removing admin roles, managing permissions, and settings' },
            
            // Community Engagement
            leveling: { price: 40, category: 'community', description: 'XP tracking, customizable level-up messages, role rewards based on activity' },
            reactionRoles: { price: 30, category: 'community', description: 'Users select roles by reacting to messages' },
            scheduledEvents: { price: 35, category: 'community', description: 'Timed pings for events, recurring announcements, role notifications' },
            polls: { price: 25, category: 'community', description: 'Choice-based polls with quick tally results' },
            giveaways: { price: 40, category: 'community', description: 'Automatically run giveaways with reaction entry, automated winner selection' },
            streamAlerts: { price: 35, category: 'community', description: 'Notify when Twitch/YouTube/Steam users go live or post new content' },
            
            // Content & Utility
            embedBuilder: { price: 30, category: 'utility', description: 'Create rich, styled message templates with minimal input' },
            utilityCommands: { price: 25, category: 'utility', description: 'Weather, time zone conversions, dictionary definitions, currency conversion, image lookup' },
            imageTools: { price: 35, category: 'utility', description: 'Meme generators, image resizing, watermarking, collage tools' },
            quotes: { price: 20, category: 'utility', description: 'Save, retrieve, and display memorable chat messages' },
            
            // Advanced Features
            aiChat: { price: 80, category: 'advanced', description: 'Natural language responses, helpdesk-style support, conversational interfaces' },
            aiContent: { price: 70, category: 'advanced', description: 'Create jokes, summaries, translations, image generation via APIs like DALL·E' },
            games: { price: 50, category: 'advanced', description: 'Trivia, typing races, dice rolls, economy systems with shops & virtual currency' },
            music: { price: 55, category: 'advanced', description: 'Queue, skip, volume control, lyrics display, multiple voice-channel support' },
            database: { price: 45, category: 'advanced', description: 'Persistent settings per guild/user, customized prefixes, per-user points/tags' },
            multiGuild: { price: 60, category: 'advanced', description: 'Guild-specific configuration, global vs per-server features, license management' },
            
            // Integration & Connectivity
            webhooks: { price: 30, category: 'integration', description: 'Allow dynamic webhooks for logging, announcements, cross-channel sync' },
            externalApis: { price: 50, category: 'integration', description: 'GitHub commits, Trello cards, Google Calendar, Jira, RSS feeds' },
            helpSystem: { price: 25, category: 'integration', description: 'Embedded documentation panels, help lookup right within Discord' },
            timeBased: { price: 35, category: 'integration', description: 'Scheduled messages & cleanup, auto-roles & temp roles, timeouts & cooldowns' }
        },
        styling: {
            customStatus: 10,
            customColor: 5
        },
        autoresponder: {
            basePrice: 15,  // Base price for enabling autoresponder
            perResponder: 5,  // Price per autoresponder
            placeholders: 10  // Additional cost for placeholders
        },
        extras: {
            apiIntegration: 35,
            hostingSetup: 10,
            readmeFile: 5,
            walkthrough: 10
        },
        deliveryMultiplier: {
            flexible: 0.9,  // 10% discount for flexible delivery
            standard: 1.0,  // Standard delivery time (no change)
            express: 1.2,   // 20% premium for express delivery
            priority: 1.5   // 50% premium for priority delivery
        }
    },
    selfbot: {
        basePrice: 75,
        features: {
            autoResponder: 25,
            autoMod: 30,
            customCommands: 20,
            aiFeatures: 50
        }
    },
    vencordPlugin: {
        basePrice: 100,
        features: {
            customUI: 40,
            enhancedFeatures: 30,
            performance: 25
        }
    },
    discordWeb: {
        basePrice: 150,
        features: {
            userAuthentication: 50,
            realTimeUpdates: 40,
            adminDashboard: 60
        }
    }
};

// Debug: Log the pricing config when the script loads
console.log('PRICING_CONFIG:', JSON.stringify(PRICING_CONFIG, null, 2));

document.addEventListener('DOMContentLoaded', function() {
    // Create the price estimator section
    const priceEstimatorSection = document.createElement('section');
    priceEstimatorSection.id = 'price-estimator';
    priceEstimatorSection.className = 'price-estimator-section';
    
    // Add the HTML content from reference.html
    priceEstimatorSection.innerHTML = `
    <div class="price-estimator-wrapper">
        <div class="projects-header">
            <h2>Price Estimator</h2>
            <p>Get an instant estimate for your custom Discord project</p>
        </div>

        <!-- Content Container -->
        <div class="relative" id="content-container">
                <!-- Card Selection View -->
                <div id="card-selection-view" class="transition-all duration-500 ease-in-out opacity-100 scale-100">
                    <div class="price-estimator-grid">
                        <!-- Discord Bot Card -->
                        <div id="discordBot" class="price-estimator-card">
                            <div class="price-estimator-card-content">
                                <div class="price-estimator-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot">
                                        <path d="M12 8V4H8"></path>
                                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                        <path d="M2 14h2"></path>
                                        <path d="M20 14h2"></path>
                                        <path d="M15 13v2"></path>
                                        <path d="M9 13v2"></path>
                                    </svg>
                                </div>
                                <h3>Discord Bot</h3>
                                <p>Custom Discord bots with advanced features</p>
                            </div>
                            <button class="custom-button primary">
                                Configure
                            </button>
                        </div>

                        <!-- Selfbot Card -->
                        <div id="selfbot" class="price-estimator-card">
                            <div class="price-estimator-card-content">
                                <div class="price-estimator-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <h3>Selfbot</h3>
                                <p>Automated Discord user accounts</p>
                            </div>
                            <button class="custom-button primary" disabled>
                                Coming soon
                            </button>
                        </div>

                        <!-- Vencord Plugin Card -->
                        <div id="vencordPlugin" class="price-estimator-card">
                            <div class="price-estimator-card-content">
                                <div class="price-estimator-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                </div>
                                <h3>Vencord Plugin</h3>
                                <p>Custom Discord client modifications</p>
                            </div>
                            <button class="custom-button primary" disabled>
                                Coming soon
                            </button>
                        </div>

                        <!-- Discord Web Card -->
                        <div id="discordWeb" class="price-estimator-card">
                            <div class="price-estimator-card-content">
                                <div class="price-estimator-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                        <path d="M2 12h20"></path>
                                    </svg>
                                </div>
                                <h3>Discord Web</h3>
                                <p>Web applications with Discord integration</p>
                            </div>
                            <button class="custom-button primary" disabled>
                                Coming soon
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Estimator Views -->
                <div id="estimator-views" class="hidden transition-all duration-500 ease-in-out opacity-100 scale-100">
                    <!-- Discord Bot Estimator -->
                    <div id="discordBot-estimator" class="hidden">
                        <div class="mb-8">
                            <button id="back-button" class="back-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                                    <path d="M19 12H5"></path>
                                    <path d="m12 19-7-7 7-7"></path>
                                </svg>
                                Back to Options
                            </button>
                        </div>

                        <div class="price-estimator-form-container">
                            <div class="price-estimator-form-header">
                                <div class="price-estimator-form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot">
                                        <path d="M12 8V4H8"></path>
                                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                        <path d="M2 14h2"></path>
                                        <path d="M20 14h2"></path>
                                        <path d="M15 13v2"></path>
                                        <path d="M9 13v2"></path>
                                    </svg>
                                </div>
                                <div class="price-estimator-form-header-content">
                                    <h3>Discord Bot Estimator</h3>
                                    <p>Configure your custom Discord bot requirements</p>
                                </div>
                            </div>
                            <div class="price-estimator-form-content">
                                <!-- Description -->
                                <div class="price-estimator-form-group">
                                    <label>Bot Description</label>
                                    <p class="price-estimator-hint">
                                        Provide a detailed description of your bot. The more detailed, the better the final product will be. 
                                        Describe each command and what it should do.
                                    </p>
                                    <textarea 
                                        id="bot-description"
                                        placeholder="I want a trading bot that allows users to create listings, search for items, manage their inventory..."
                                    ></textarea>
                                </div>

                                <!-- Inline Form Groups Container -->
                                <div class="price-estimator-form-groups-inline">
                                    <!-- Bot Type -->
                                    <div class="price-estimator-form-group">
                                        <label>Bot Type</label>
                                        <select id="bot-type" class="form-dropdown">
                                            <option value="">Select bot type</option>
                                            <option value="moderation">Moderation</option>
                                            <option value="utility">Utility</option>
                                            <option value="music">Music</option>
                                            <option value="economy">Economy</option>
                                            <option value="aiChatbot">AI Chatbot</option>
                                            <option value="multipurpose">Multi-purpose</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>

                                    <!-- Delivery Preference -->
                                    <div class="price-estimator-form-group">
                                        <label>Delivery Preference</label>
                                        <select id="delivery-preference" class="form-dropdown">
                                            <option value="flexible">Flexible (-10%)</option>
                                            <option value="standard" selected>Standard</option>
                                            <option value="express">Express (+20%)</option>
                                            <option value="priority">Priority (+50%)</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Commands -->
                                <div class="price-estimator-form-group">
                                    <label>Commands</label>
                                    
                                    <div class="commands-grid">
                                        <!-- Slash Commands Tile -->
                                        <div class="command-tile">
                                            <div class="command-tile-header">
                                                <span>Slash Commands</span>
                                                <span class="command-count" id="slash-commands-value">5</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                class="command-slider"
                                                id="slash-commands-slider"
                                                value="5"
                                                min="1"
                                                max="50"
                                            />
                                        </div>

                                        <!-- Message Commands Tile -->
                                        <div class="command-tile">
                                            <div class="command-tile-header">
                                                <span>Message Commands</span>
                                                <span class="command-count" id="message-commands-value">0</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                class="command-slider"
                                                id="message-commands-slider"
                                                value="0"
                                                min="0"
                                                max="50"
                                            />
                                        </div>

                                        <!-- Autoresponder Tile -->
                                        <div class="command-tile command-tile-feature" id="autoresponder-tile" style="cursor: pointer;">
                                            <div class="command-feature-toggle">
                                                <span class="command-feature-label">Autoresponder System</span>
                                                <span class="autoresponder-count ml-2 text-sm text-gray-400"></span>
                                            </div>
                                            <span class="command-feature-price">+$0</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Features -->
                                <div class="price-estimator-form-group">
                                    <label>Features</label>
                                    <div id="bot-features">
                                        <!-- Categories will be populated by JavaScript -->
                                        <div class="feature-category">
                                            <h4 class="category-title">Core Interaction</h4>
                                            <div class="price-estimator-features-grid" data-category="core">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>

                                        <div class="feature-category">
                                            <h4 class="category-title">Moderation & Management</h4>
                                            <div class="price-estimator-features-grid" data-category="moderation">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>

                                        <div class="feature-category">
                                            <h4 class="category-title">Community Engagement</h4>
                                            <div class="price-estimator-features-grid" data-category="community">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>

                                        <div class="feature-category">
                                            <h4 class="category-title">Content & Utilities</h4>
                                            <div class="price-estimator-features-grid" data-category="utility">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>

                                        <div class="feature-category">
                                            <h4 class="category-title">Advanced Features</h4>
                                            <div class="price-estimator-features-grid" data-category="advanced">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>

                                        <div class="feature-category">
                                            <h4 class="category-title">Integration & Connectivity</h4>
                                            <div class="price-estimator-features-grid" data-category="integration">
                                                <!-- Will be populated by JavaScript -->
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- AI Integration Input (initially hidden) -->
                                    <div id="ai-integration-input-container" class="hidden">
                                        <input 
                                            id="ai-integration-input"
                                            placeholder="e.g., ChatGPT, Claude, Gemini"
                                            style="margin-top: 0.5rem;"
                                        />
                                    </div>
                                </div>

                                <!-- Styling -->
                                <div class="price-estimator-form-group">
                                    <label>Styling / Branding</label>
                                    
                                    <div class="price-estimator-feature-group">
                                        <div class="price-estimator-input-group">
                                            <label>Custom Bot Status</label>
                                            <div class="price-estimator-status-controls">
                                                <select id="custom-status-type">
                                                    <option value="playing">Playing</option>
                                                    <option value="streaming">Streaming</option>
                                                    <option value="watching">Watching</option>
                                                </select>
                                                <input 
                                                    id="custom-status"
                                                    placeholder="with Discord API"
                                                />
                                            </div>
                                        </div>

                                        <div class="price-estimator-input-group">
                                            <label>Custom Color</label>
                                            <input 
                                                type="color"
                                                id="custom-color"
                                                value="#000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- Extras -->
                                <div class="price-estimator-form-group">
                                    <label>Extras</label>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                        <!-- Left Column: API Integration -->
                                        <div class="price-estimator-input-group" style="display: flex; flex-direction: column; height: 100%;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                                <label>API Integration</label>
                                                <span class="price-estimator-feature-price">+$35</span>
                                            </div>
                                            <div style="flex: 1; display: flex; min-height: 0;">
                                                <textarea 
                                                    id="api-integrations"
                                                    placeholder="Provide API names and testing API keys for each integration needed"
                                                    style="resize: vertical; min-height: 100px; max-height: 150px; width: 100%; min-width: 100%; max-width: 100%; box-sizing: border-box;"
                                                ></textarea>
                                            </div>
                                        </div>
                                        
                                        <!-- Right Column: Additional Features -->
                                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                                            <!-- Hosting Setup -->
                                            <div class="price-estimator-feature-item">
                                                <input type="checkbox" id="hosting-setup">
                                                <label for="hosting-setup">Hosting Setup (Requires account/server access)</label>
                                                <span class="price-estimator-feature-price">+$10</span>
                                            </div>
                                            
                                            <!-- Readme File -->
                                            <div class="price-estimator-feature-item">
                                                <input type="checkbox" id="readme-file">
                                                <label for="readme-file">Readme file (Documentation & installation)</label>
                                                <span class="price-estimator-feature-price">+$5</span>
                                            </div>
                                            
                                            <!-- Walkthrough -->
                                            <div class="price-estimator-feature-item">
                                                <input type="checkbox" id="walkthrough">
                                                <label for="walkthrough">One-on-one Walkthrough (Demo in test server)</label>
                                                <span class="price-estimator-feature-price">+$10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price Display -->
                                <div class="price-estimator-summary">
                                    <div class="price-estimator-summary-row">
                                        <span>Estimated Price:</span>
                                        <span id="estimated-price" class="price-estimator-price">$0</span>
                                    </div>
                                    <div class="price-estimator-summary-row">
                                        <span>Estimated Time:</span>
                                        <span id="estimated-time">TBD</span>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <button 
                                    id="submit-bot"
                                    class="custom-button primary"
                                    disabled
                                >
                                    Submit & Generate Summary
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Selfbot Estimator -->
                    <div id="selfbot-estimator" class="hidden">
                        <div class="mb-8">
                            <button class="back-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                                    <path d="M19 12H5"></path>
                                    <path d="m12 19-7-7 7-7"></path>
                                </svg>
                                Back to Options
                            </button>
                        </div>

                        <div class="price-estimator-form-container">
                            <div class="price-estimator-form-header">
                                <div class="price-estimator-form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <div class="price-estimator-form-header-content">
                                    <h3>Selfbot Estimator</h3>
                                    <p>Configure your custom selfbot requirements</p>
                                </div>
                            </div>
                            <div class="price-estimator-form-content">
                                <!-- Description -->
                                <div class="price-estimator-form-group">
                                    <label>Selfbot Description</label>
                                    <p class="price-estimator-hint">
                                        Describe what you want your selfbot to do. Be specific about automation features and behaviors.
                                    </p>
                                    <textarea 
                                        id="selfbot-description"
                                        placeholder="I want a selfbot that can automatically moderate my server, schedule messages, and track user activity..."
                                    ></textarea>
                                </div>

                                <!-- Features -->
                                <div class="price-estimator-form-group">
                                    <label>Features</label>
                                    <div class="price-estimator-features-grid" id="selfbot-features">
                                        <!-- Features will be added here by JavaScript -->
                                    </div>
                                </div>

                                <!-- Automation Level -->
                                <div class="price-estimator-form-group">
                                    <label>Automation Level</label>
                                    <select id="selfbot-type">
                                        <option value="">Select automation level</option>
                                        <option value="basic">Basic Automation</option>
                                        <option value="advanced">Advanced Automation</option>
                                        <option value="premium">Premium Automation</option>
                                    </select>
                                </div>

                                <!-- Price Display -->
                                <div class="price-estimator-summary">
                                    <div class="price-estimator-summary-row">
                                        <span>Estimated Price:</span>
                                        <span id="selfbot-estimated-price" class="price-estimator-price">$0</span>
                                    </div>
                                    <div class="price-estimator-summary-row">
                                        <span>Estimated Time:</span>
                                        <span>3 - 5 days</span>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <button 
                                    id="submit-selfbot"
                                    class="custom-button primary"
                                    disabled
                                >
                                    Submit & Generate Summary
                                </button>
                            </div>
                        </div>
                    </div>

                        <!-- Vencord Plugin Estimator -->
                        <div id="vencordPlugin-estimator" class="hidden">
                            <div class="mb-8">
                                <button class="back-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                                        <path d="M19 12H5"></path>
                                        <path d="m12 19-7-7 7-7"></path>
                                    </svg>
                                    Back to Options
                                </button>
                            </div>

                            <div class="price-estimator-form-container">
                                <div class="price-estimator-form-header">
                                    <div class="price-estimator-form-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    </div>
                                    <div class="price-estimator-form-header-content">
                                        <h3>Vencord Plugin Estimator</h3>
                                        <p>Configure your custom Vencord plugin requirements</p>
                                    </div>
                                </div>
                                <div class="price-estimator-form-content">
                                    <!-- Description -->
                                    <div class="price-estimator-form-group">
                                        <label>Plugin Description</label>
                                        <p class="price-estimator-hint">
                                            Describe what functionality you want your Vencord plugin to add to Discord.
                                        </p>
                                        <textarea 
                                            id="vencord-description"
                                            placeholder="I want a plugin that adds custom UI elements, enhances message display, and integrates with external services..."
                                        ></textarea>
                                    </div>

                                    <!-- Plugin Type -->
                                    <div class="price-estimator-form-group">
                                        <label>Plugin Type</label>
                                        <select id="vencord-type">
                                            <option value="">Select plugin type</option>
                                            <option value="ui">UI Enhancement</option>
                                            <option value="functionality">Functionality Extension</option>
                                            <option value="integration">External Integration</option>
                                            <option value="theme">Theme/Visual</option>
                                        </select>
                                    </div>

                                    <!-- Features -->
                                    <div class="price-estimator-form-group">
                                        <label>Features</label>
                                        <div class="price-estimator-features-grid" id="vencord-features">
                                            <!-- Features will be added here by JavaScript -->
                                        </div>
                                    </div>

                                    <!-- Complexity Level -->
                                    <div class="price-estimator-form-group">
                                        <label>Complexity Level</label>
                                        <div class="price-estimator-range-group">
                                            <input 
                                                type="range" 
                                                class="estimator-slider"
                                                id="vencord-complexity-slider"
                                                value="1"
                                                min="1"
                                                max="10"
                                            />
                                            <span id="vencord-complexity-value">Level 1</span>
                                        </div>
                                        <p class="price-estimator-hint">Higher complexity levels require more advanced modifications and testing</p>
                                    </div>

                                    <!-- Price Display -->
                                    <div class="price-estimator-summary">
                                        <div class="price-estimator-summary-row">
                                            <span>Estimated Price:</span>
                                            <span id="vencord-estimated-price" class="price-estimator-price">$0</span>
                                        </div>
                                        <div class="price-estimator-summary-row">
                                            <span>Estimated Time:</span>
                                            <span>4 - 7 days</span>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <button 
                                        id="submit-vencord"
                                        class="custom-button primary"
                                        disabled
                                    >
                                        Submit & Generate Summary
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Discord Web Estimator -->
                        <div id="discordWeb-estimator" class="hidden">
                            <div class="mb-8">
                                <button class="back-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                                        <path d="M19 12H5"></path>
                                        <path d="m12 19-7-7 7-7"></path>
                                    </svg>
                                    Back to Options
                                </button>
                            </div>

                            <div class="price-estimator-form-container">
                                <div class="price-estimator-form-header">
                                    <div class="price-estimator-form-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                            <path d="M2 12h20"></path>
                                        </svg>
                                    </div>
                                    <div class="price-estimator-form-header-content">
                                        <h3>Discord Web Application</h3>
                                        <p>Configure your custom web application with Discord integration</p>
                                    </div>
                                </div>
                                <div class="price-estimator-form-content">
                                    <!-- Description -->
                                    <div class="price-estimator-form-group">
                                        <label>Project Description</label>
                                        <p class="price-estimator-hint">
                                            Describe your web application and how it will integrate with Discord.
                                        </p>
                                        <textarea 
                                            id="web-description"
                                            placeholder="I want to build a web application that integrates with Discord to provide server management, analytics, and custom features..."
                                        ></textarea>
                                    </div>

                                    <!-- Application Type -->
                                    <div class="price-estimator-form-group">
                                        <label>Application Type</label>
                                        <select id="web-type">
                                            <option value="">Select application type</option>
                                            <option value="dashboard">Server Dashboard</option>
                                            <option value="bot-manager">Bot Management Panel</option>
                                            <option value="community">Community Platform</option>
                                            <option value="analytics">Analytics Platform</option>
                                            <option value="custom">Custom Application</option>
                                        </select>
                                    </div>

                                    <!-- Pages Count -->
                                    <div class="price-estimator-form-group">
                                        <label>Number of Pages</label>
                                        <div class="price-estimator-range-group">
                                            <input 
                                                type="range"
                                                class="estimator-slider"
                                                id="web-pages-slider"
                                                value="1"
                                                min="1"
                                                max="20"
                                            />
                                            <input 
                                                type="number"
                                                id="web-pages-input"
                                                min="1"
                                                max="20"
                                                value="1"
                                            />
                                        </div>
                                    </div>

                                    <!-- Features -->
                                    <div class="price-estimator-form-group">
                                        <label>Features</label>
                                        <div class="price-estimator-features-grid" id="web-features">
                                            <!-- Features will be added here by JavaScript -->
                                        </div>
                                    </div>

                                    <!-- Technology Stack -->
                                    <div class="price-estimator-form-group">
                                        <label>Preferred Technology Stack</label>
                                        <select id="web-tech-stack">
                                            <option value="react">React + Node.js</option>
                                            <option value="nextjs">Next.js</option>
                                            <option value="vue">Vue.js + Express</option>
                                            <option value="custom">Custom Stack</option>
                                        </select>
                                    </div>

                                    <!-- Hosting Setup -->
                                    <div class="price-estimator-form-group">
                                        <div class="price-estimator-checkbox-group">
                                            <input type="checkbox" id="web-hosting-setup">
                                            <label>Hosting & Deployment Setup</label>
                                            <span class="price-estimator-feature-price">+$75</span>
                                        </div>
                                    </div>

                                    <!-- Price Display -->
                                    <div class="price-estimator-summary">
                                        <div class="price-estimator-summary-row">
                                            <span>Estimated Price:</span>
                                            <span id="web-estimated-price" class="price-estimator-price">$0</span>
                                        </div>
                                        <div class="price-estimator-summary-row">
                                            <span>Estimated Time:</span>
                                            <span>1 - 3 weeks</span>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <button 
                                        id="submit-web"
                                        class="custom-button primary"
                                        disabled
                                    >
                                        Submit & Generate Summary
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Summary Modal -->
    <div id="summary-modal" style="opacity: 0; visibility: hidden; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 1000; padding: 2rem; box-sizing: border-box; overflow: hidden; display: flex; justify-content: center; align-items: center;">
        <style>
            #summary-modal *::-webkit-scrollbar { display: none !important; }
            #summary-modal * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        </style>
        <div style="background-color: #262626; border-radius: 16px; width: 100%; max-width: 900px; height: 100%; max-height: 90vh; margin: 0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
            <!-- Header -->
            <div style="flex-shrink: 0; padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #fff; font-size: 1.25rem; font-weight: 600; margin: 0; letter-spacing: 0.5px;">BOT ESTIMATE GENERATED</h3>
                <button id="close-modal" style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <!-- Scrollable Content -->
            <div style="flex: 1; overflow-y: auto; -ms-overflow-style: none; scrollbar-width: none; display: flex; justify-content: center; width: 100%;">
                <div style="width: 100%; max-width: 800px; padding: 1.5rem 2rem; box-sizing: border-box;">
                    <div id="summary-content" style="color: #e5e7eb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 0.95rem; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word; text-align: left; width: 100%;"></div>
                    
                    <!-- Instructions -->
                    <div style="background-color: rgba(255, 255, 255, 0.04); border-radius: 10px; padding: 1.5rem; margin: 1.5rem 0 0; border: 1px solid rgba(255, 255, 255, 0.05); width: 100%; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #9ca3af; font-size: 0.9rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem; flex-shrink: 0;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Next Steps</span>
                        </div>
                        <p style="color: #9ca3af; font-size: 0.9rem; margin: 0; line-height: 1.6;">
                            Copy and paste the entire summary above, including your description, into the "Requirements" box when ordering on Fiverr or DMing me directly.
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="flex-shrink: 0; padding: 1.5rem 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: flex-end; gap: 1rem;">
                <button id="copy-summary" class="custom-button primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                    Copy Summary
                </button>
                <button class="custom-button secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- Autoresponder Modal -->
    <div id="autoresponder-modal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Autoresponder System</h3>
            </div>
            <div class="modal-body">
                <p class="text-gray-400 mb-6">Set up automatic responses to specific triggers. Each responder will add $3 to your total.</p>
                
                <!-- Current Autoresponders List -->
                <div id="autoresponders-list">
                    <!-- Autoresponders will be listed here -->
                </div>
                
                <!-- Add/Edit Autoresponder Form -->
                <div id="autoresponder-form">
                    <h4>
                        <span id="form-title">Add New Autoresponder</span>
                        <span id="editing-id" class="hidden"></span>
                    </h4>
                    
                    <div>
                        <div class="form-group">
                            <label for="trigger-input">Trigger</label>
                            <input type="text" id="trigger-input" placeholder="e.g., !hello">
                        </div>
                        
                        <div class="form-group">
                            <label for="response-input">Response</label>
                            <textarea id="response-input" rows="4" placeholder="Type the response message here..."></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <div class="left-actions">
                                <div class="toggle-container">
                                    <input type="checkbox" id="enable-placeholders">
                                    <label for="enable-placeholders">Enable Placeholders (+$30)</label>
                                </div>
                            </div>
                            
                            <div class="right-actions">
                                <button id="cancel-edit" class="custom-button secondary hidden">Cancel</button>
                                <button id="save-autoresponder" class="custom-button primary">Save Responder</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Instructions -->
                <div class="instructions">
                    <h4>How it works:</h4>
                    <ul>
                        <li>Each responder will automatically reply when the trigger is detected</li>
                        <li>Triggers are not case-sensitive</li>
                        <li>Each responder adds $3 to your total</li>
                        <li>Placeholders add $30 for the entire system</li>
                    </ul>
                </div>
                
                <div class="modal-footer">
                    <button id="close-autoresponder" class="custom-button secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Insert the section after the services section
    const servicesSection = document.getElementById('services');
    servicesSection.parentNode.insertBefore(priceEstimatorSection, servicesSection.nextSibling);

    // Initialize the price estimator functionality
    initPriceEstimator();
});

function initPriceEstimator() {
    // State management
    let selectedCard = null;
    let estimatorState = {
        description: '',
        botType: 'basic',
        slashCommands: 5,
        messageCommands: 0,
        autoresponder: false,
        autoresponderCount: 0,  // Number of autoresponders
        autoresponderPlaceholders: false,  // Whether placeholders are enabled
        features: [],
        customStatus: '',
        customStatusType: 'playing',
        customColor: '#000000',
        deliveryPreference: 'standard',
        apiIntegrations: '',
        hostingSetup: false,
        aiIntegration: ''
    };

    // Setup card selection
    function setupCardSelection() {
        const cards = ['discordBot', 'selfbot', 'vencordPlugin', 'discordWeb'];
        
        cards.forEach(cardId => {
            const card = document.getElementById(cardId);
            card.addEventListener('click', () => {
                // Only allow interaction with Discord Bot card for now
                if (cardId !== 'discordBot') {
                    return;
                }
                
                selectedCard = cardId;
                document.getElementById('card-selection-view').classList.add('hidden');
                document.getElementById('estimator-views').classList.remove('hidden');
                document.getElementById(`${cardId}-estimator`).classList.remove('hidden');
                
                // Reset the state for the new estimator
                resetEstimatorState();
                
                // Update the UI based on the selected card
                updateEstimatorUI();
            });
        });
    }

    // Setup Discord Bot estimator
    function setupDiscordBotEstimator() {
        // Back button
        document.getElementById('back-button').addEventListener('click', goBackToSelection);
        
        // Submit button
        const submitButton = document.getElementById('submit-bot');
        console.log('Submit button element:', submitButton);
        if (submitButton) {
            console.log('Adding click event listener to submit button');
            submitButton.addEventListener('click', function(e) {
                console.log('Submit button clicked!');
                e.preventDefault();
                console.log('Calling showSummaryModal');
                try {
                    showSummaryModal();
                    console.log('showSummaryModal called successfully');
                } catch (error) {
                    console.error('Error in showSummaryModal:', error);
                }
            });
            // Enable the submit button by default
            submitButton.disabled = false;
            console.log('Submit button enabled');
        } else {
            console.error('Submit button not found!');
        }
        
        // Description
        document.getElementById('bot-description').addEventListener('input', function() {
            estimatorState.description = this.value;
            updateSubmitButtonState();
            calculateDiscordBotPrice();
        });
        
        // Bot type
        document.getElementById('bot-type').addEventListener('change', function() {
            estimatorState.botType = this.value;
            updateSubmitButtonState();
            calculateDiscordBotPrice();
        });
        
        // Slash commands
        const slashCommandsSlider = document.getElementById('slash-commands-slider');
        const slashCommandsValue = document.getElementById('slash-commands-value');
        
        slashCommandsSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            slashCommandsValue.textContent = value;
            estimatorState.slashCommands = value;
            calculateDiscordBotPrice();
        });
        
        // Message commands
        const messageCommandsSlider = document.getElementById('message-commands-slider');
        const messageCommandsValue = document.getElementById('message-commands-value');
        
        messageCommandsSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            messageCommandsValue.textContent = value;
            estimatorState.messageCommands = value;
            calculateDiscordBotPrice();
        });
        
        // Autoresponder tile click handler
        const autoresponderTile = document.getElementById('autoresponder-tile');
        console.log('Autoresponder tile element:', autoresponderTile);
        if (autoresponderTile) {
            console.log('Adding click event listener to autoresponder tile');
            autoresponderTile.addEventListener('click', function(e) {
                console.log('Autoresponder tile clicked!');
                e.preventDefault();
                e.stopPropagation();
                console.log('Calling openAutoresponderModal');
                openAutoresponderModal();
                return false;
            });
        } else {
            console.error('Autoresponder tile not found!');
        }
        
        // Initialize autoresponders array in state if not exists
        if (!estimatorState.autoresponders) {
            estimatorState.autoresponders = [];
        }
        
        // Ensure autoresponder state is properly initialized
        if (estimatorState.autoresponder === undefined) {
            estimatorState.autoresponder = false;
        }
        if (estimatorState.autoresponderCount === undefined) {
            estimatorState.autoresponderCount = 0;
        }
        if (estimatorState.autoresponderPlaceholders === undefined) {
            estimatorState.autoresponderPlaceholders = false;
        }
        
        // Autoresponder Modal Functions
        function renderAutorespondersList() {
            const listContainer = document.getElementById('autoresponders-list');
            if (!listContainer) return;
            
            // Ensure autoresponders array exists
            if (!estimatorState.autoresponders || !Array.isArray(estimatorState.autoresponders)) {
                estimatorState.autoresponders = [];
            }
            
            listContainer.innerHTML = '';
            
            if (estimatorState.autoresponders.length === 0) {
                listContainer.innerHTML = '<p class="text-gray-400 italic">No autoresponders added yet.</p>';
                return;
            }
            
            estimatorState.autoresponders.forEach((responder, index) => {
                const responderElement = document.createElement('div');
                responderElement.className = 'autoresponder-item';
                responderElement.innerHTML = `
                    <div class="autoresponder-content">
                        <div class="autoresponder-trigger">${responder.trigger}</div>
                        <div class="autoresponder-response">${responder.response}</div>
                    </div>
                    <div class="autoresponder-actions">
                        <button class="edit-btn" data-index="${index}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-index="${index}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add edit and delete event listeners
                responderElement.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(e.currentTarget.getAttribute('data-index'));
                    editAutoresponder(index);
                });
                
                responderElement.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(e.currentTarget.getAttribute('data-index'));
                    deleteAutoresponder(index);
                });
                
                // Make the whole item clickable for edit
                responderElement.addEventListener('click', () => {
                    editAutoresponder(index);
                });
                
                listContainer.appendChild(responderElement);
            });
        }
        
        function editAutoresponder(index) {
            const responder = estimatorState.autoresponders[index];
            document.getElementById('trigger-input').value = responder.trigger;
            document.getElementById('response-input').value = responder.response;
            document.getElementById('enable-placeholders').checked = responder.placeholders || false;
            document.getElementById('form-title').textContent = 'Edit Autoresponder';
            document.getElementById('editing-id').textContent = index;
            document.getElementById('cancel-edit').classList.remove('hidden');
            document.getElementById('trigger-input').focus();
        }
        
        function deleteAutoresponder(index) {
            estimatorState.autoresponders.splice(index, 1);
            renderAutorespondersList();
            updateAutoresponderState();
        }
        
        function updateAutoresponderState() {
            // Update the main state based on whether we have any autoresponders
            const hasAutoresponders = estimatorState.autoresponders.length > 0;
            estimatorState.autoresponder = hasAutoresponders;
            estimatorState.autoresponderCount = estimatorState.autoresponders.length;
            
            // Update the UI to show count and price
            const autoresponderLabel = document.querySelector('label[for="autoresponder"]');
            const autoresponderTile = document.getElementById('autoresponder-tile');
            
            if (autoresponderLabel) {
                let statusSpan = autoresponderLabel.querySelector('.autoresponder-status');
                if (!statusSpan) {
                    statusSpan = document.createElement('span');
                    statusSpan.className = 'autoresponder-status ml-2 text-sm';
                    autoresponderLabel.appendChild(statusSpan);
                }
                
                if (estimatorState.autoresponders.length > 0) {
                    statusSpan.textContent = `(${estimatorState.autoresponders.length} configured)`;
                    statusSpan.className = 'autoresponder-status ml-2 text-sm text-green-400';
                } else {
                    statusSpan.textContent = '';
                }
            }
            
            // Update the price display on the autoresponder tile
            if (autoresponderTile) {
                const priceSpan = autoresponderTile.querySelector('.command-feature-price');
                const countSpan = autoresponderTile.querySelector('.autoresponder-count');
                
                if (priceSpan && countSpan) {
                    const config = PRICING_CONFIG.discordBot.autoresponder;
                    let totalPrice = 0;
                    
                    if (hasAutoresponders) {
                        // Only add base price if we have at least one autoresponder
                        totalPrice += config.basePrice;
                        
                        // Add per-responder cost for each responder beyond the first one
                        if (estimatorState.autoresponderCount > 0) {
                            totalPrice += estimatorState.autoresponderCount * config.perResponder;
                            countSpan.textContent = `(${estimatorState.autoresponderCount} configured)`;
                            countSpan.style.display = 'inline';
                        } else {
                            countSpan.textContent = '';
                            countSpan.style.display = 'none';
                        }
                        
                        // Add placeholders cost if enabled
                        if (estimatorState.autoresponderPlaceholders) {
                            totalPrice += config.placeholders || 0;
                        }
                        
                        priceSpan.textContent = `+$${totalPrice}`;
                        priceSpan.style.display = 'inline';
                    } else {
                        // No autoresponders configured
                        priceSpan.textContent = '+$0';
                        priceSpan.style.display = 'none';
                        countSpan.textContent = '';
                        countSpan.style.display = 'none';
                        
                        // Also ensure the autoresponder state is false
                        estimatorState.autoresponder = false;
                    }
                }
            }
            
            // Update the main price calculation
            calculateDiscordBotPrice();
        }
        
        // Open modal
        function openAutoresponderModal() {
            console.log('openAutoresponderModal called');
            const modal = document.getElementById('autoresponder-modal');
            console.log('Modal element:', modal);
            
            // Reset form
            const triggerInput = document.getElementById('trigger-input');
            const responseInput = document.getElementById('response-input');
            const placeholdersCheckbox = document.getElementById('enable-placeholders');
            const formTitle = document.getElementById('form-title');
            const editingId = document.getElementById('editing-id');
            const cancelEdit = document.getElementById('cancel-edit');
            
            console.log('Form elements:', { triggerInput, responseInput, placeholdersCheckbox, formTitle, editingId, cancelEdit });
            
            if (triggerInput) triggerInput.value = '';
            if (responseInput) responseInput.value = '';
            if (placeholdersCheckbox) placeholdersCheckbox.checked = estimatorState.autoresponderPlaceholders || false;
            if (formTitle) formTitle.textContent = 'Add New Autoresponder';
            if (editingId) editingId.textContent = '';
            if (cancelEdit) cancelEdit.classList.add('hidden');
            
            // Update the state
            estimatorState.autoresponder = true;
            console.log('Updated estimatorState:', estimatorState);
            
            // Render existing responders
            renderAutorespondersList();
            
            // Show modal
            if (modal) {
                console.log('Removing hidden class from modal');
                modal.classList.remove('hidden');
                // Ensure the modal is displayed as flex
                modal.style.display = 'flex';
                if (triggerInput) {
                    console.log('Focusing on trigger input');
                    triggerInput.focus();
                }
            } else {
                console.error('Could not find modal element!');
            }
            
            return false; // Prevent default action
        }
        
        // Make the openAutoresponderModal function call the local function
        window.openAutoresponderModal = openAutoresponderModal;
        
        // Close modal
        function closeAutoresponderModal(e) {
            console.log('closeAutoresponderModal called', { event: e });
            const modal = document.getElementById('autoresponder-modal');
            console.log('Modal element:', modal);
            if (modal) {
                console.log('Adding hidden class to modal');
                modal.classList.add('hidden');
                // Also ensure display is set to none
                modal.style.display = 'none';
                console.log('Modal classes after hiding:', modal.className);
            } else {
                console.error('Could not find autoresponder modal element');
            }
        }
        
        // Close button events
        const closeButton = document.getElementById('close-autoresponder');
        console.log('Close button element:', closeButton);
        
        if (closeButton) {
            closeButton.addEventListener('click', function(e) {
                console.log('Close button clicked', { event: e });
                e.preventDefault();
                e.stopPropagation();
                closeAutoresponderModal(e);
            });
        } else {
            console.error('Could not find close button element');
        }
        
        // Click outside to close
        document.addEventListener('click', function(e) {
            console.log('Document click event', { target: e.target, id: e.target.id });
            if (e.target.id === 'autoresponder-modal') {
                console.log('Clicked on modal background');
                closeAutoresponderModal(e);
            }
        });
        
        // Cancel edit button
        document.getElementById('cancel-edit').addEventListener('click', function() {
            document.getElementById('trigger-input').value = '';
            document.getElementById('response-input').value = '';
            document.getElementById('form-title').textContent = 'Add New Autoresponder';
            document.getElementById('editing-id').textContent = '';
            this.classList.add('hidden');
        });
        
        // Save autoresponder
        document.getElementById('save-autoresponder').addEventListener('click', function() {
            const trigger = document.getElementById('trigger-input').value.trim();
            const response = document.getElementById('response-input').value.trim();
            const placeholders = document.getElementById('enable-placeholders').checked;
            const editingId = document.getElementById('editing-id').textContent;
            
            if (!trigger || !response) {
                alert('Please fill in both trigger and response fields');
                return;
            }
            
            const responder = {
                trigger: trigger,
                response: response,
                placeholders: placeholders
            };
            
            if (editingId !== '') {
                // Update existing responder
                const index = parseInt(editingId);
                estimatorState.autoresponders[index] = responder;
            } else {
                // Add new responder
                estimatorState.autoresponders.push(responder);
            }
            
            // Update placeholders setting if any responder has it enabled
            estimatorState.autoresponderPlaceholders = placeholders || 
                estimatorState.autoresponders.some(r => r.placeholders);
            
            // Update UI and state
            renderAutorespondersList();
            updateAutoresponderState();
            
            // Reset form
            document.getElementById('trigger-input').value = '';
            document.getElementById('response-input').value = '';
            document.getElementById('editing-id').textContent = '';
            document.getElementById('form-title').textContent = 'Add New Autoresponder';
            document.getElementById('cancel-edit').classList.add('hidden');
            document.getElementById('trigger-input').focus();
        });
        
        // Features - Now handled directly in HTML with data attributes
        document.querySelectorAll('.price-estimator-feature-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label');
            const featureId = checkbox.id;
            const featurePrice = parseInt(checkbox.dataset.price || '0');
            
            // Function to update the feature state
            const updateFeatureState = () => {
                if (checkbox.checked) {
                    if (!estimatorState.features.includes(featureId)) {
                        estimatorState.features.push(featureId);
                    }
                } else {
                    estimatorState.features = estimatorState.features.filter(f => f !== featureId);
                }
                
                // Handle AI integration specific behavior
                if (featureId === 'aiIntegration') {
                    const container = document.getElementById('ai-integration-input-container');
                    const input = document.getElementById('ai-integration-input');
                    
                    if (checkbox.checked) {
                        container.classList.remove('hidden');
                        if (input) {
                            input.disabled = false;
                            setTimeout(() => { input.focus(); }, 10);
                        }
                    } else {
                        container.classList.add('hidden');
                        if (input) {
                            input.value = '';
                            input.disabled = false;
                        }
                    }
                }
                
                // Update the price calculation
                calculateDiscordBotPrice();
            };
            
            // Handle clicks on the entire item (except the checkbox and label)
            item.addEventListener('click', (e) => {
                // If the click was on the checkbox or label, let the default behavior handle it
                if (e.target === checkbox || e.target === label) {
                    return;
                }
                
                // Toggle the checkbox state
                checkbox.checked = !checkbox.checked;
                
                // Update the state
                updateFeatureState();
                
                // Prevent the event from bubbling up to parent elements
                e.stopPropagation();
            });
            
            // Handle changes to the checkbox (including label clicks)
            checkbox.addEventListener('change', function() {
                updateFeatureState();
            });
            
            // Initialize the feature state
            if (checkbox.checked) {
                if (!estimatorState.features.includes(featureId)) {
                    estimatorState.features.push(featureId);
                }
            }
        });
        
        // AI Integration input change handler
        document.addEventListener('input', function(e) {
            if (e.target && e.target.id === 'ai-integration-input') {
                // Update the state with the AI integration details
                const aiIntegrationValue = e.target.value.trim();
                if (aiIntegrationValue) {
                    estimatorState.aiIntegration = aiIntegrationValue;
                } else {
                    delete estimatorState.aiIntegration;
                }
                calculateDiscordBotPrice();
            }
        });
        
        // Custom status
        document.getElementById('custom-status').addEventListener('input', function() {
            estimatorState.customStatus = this.value;
            calculateDiscordBotPrice();
        });
        
        document.getElementById('custom-status-type').addEventListener('change', function() {
            estimatorState.customStatusType = this.value;
        });
        
        // Custom color
        document.getElementById('custom-color').addEventListener('input', function() {
            estimatorState.customColor = this.value;
            calculateDiscordBotPrice();
        });
        
        // Delivery preference
        document.getElementById('delivery-preference').addEventListener('change', function() {
            estimatorState.deliveryPreference = this.value;
            calculateDiscordBotPrice();
        });
        
        // API integrations
        document.getElementById('api-integrations').addEventListener('input', function() {
            estimatorState.apiIntegrations = this.value;
            calculateDiscordBotPrice();
        });
        
        // Extras event listeners
        document.getElementById('hosting-setup').addEventListener('change', function() {
            estimatorState.hostingSetup = this.checked;
            calculateDiscordBotPrice();
        });
        
        document.getElementById('readme-file').addEventListener('change', function() {
            estimatorState.readmeFile = this.checked;
            calculateDiscordBotPrice();
        });
        
        document.getElementById('walkthrough').addEventListener('change', function() {
            estimatorState.walkthrough = this.checked;
            calculateDiscordBotPrice();
        });
        
        // Submit button
        document.getElementById('submit-bot').addEventListener('click', showSummaryModal);
    }

    // Setup Selfbot estimator
    function setupSelfbotEstimator() {
        // Back button
        document.querySelectorAll('.back-button').forEach(btn => {
            btn.addEventListener('click', goBackToSelection);
        });
        
        // Description
        document.getElementById('selfbot-description').addEventListener('input', function() {
            estimatorState.description = this.value;
            updateSubmitButtonState();
            calculateSelfbotPrice();
        });
        
        // Features
        const selfbotFeaturesContainer = document.getElementById('selfbot-features');
        const selfbotFeatures = [
            { id: 'autoModeration', label: 'Auto Moderation', price: 20 },
            { id: 'messageScheduling', label: 'Message Scheduling', price: 15 },
            { id: 'autoReactions', label: 'Auto Reactions', price: 10 },
            { id: 'customCommands', label: 'Custom Commands', price: 25 },
            { id: 'userTracking', label: 'User Activity Tracking', price: 30 },
            { id: 'antiRaid', label: 'Anti-Raid Protection', price: 35 }
        ];
        
        selfbotFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'price-estimator-feature-item';
            featureElement.innerHTML = `
                <input type="checkbox" id="selfbot-${feature.id}">
                <label for="selfbot-${feature.id}">${feature.label}</label>
                <span class="price-estimator-feature-price">+$${feature.price}</span>
            `;
            selfbotFeaturesContainer.appendChild(featureElement);
            
            document.getElementById(`selfbot-${feature.id}`).addEventListener('change', function() {
                if (this.checked) {
                    if (!estimatorState.features.includes(feature.id)) {
                        estimatorState.features.push(feature.id);
                    }
                } else {
                    estimatorState.features = estimatorState.features.filter(f => f !== feature.id);
                }
                calculateSelfbotPrice();
            });
        });
        
        // Automation level
        document.getElementById('selfbot-type').addEventListener('change', function() {
            estimatorState.botType = this.value;
            updateSubmitButtonState();
            calculateSelfbotPrice();
        });
        
        // Submit button
        document.getElementById('submit-selfbot').addEventListener('click', showSummaryModal);
    }

    // Setup Vencord Plugin estimator
    function setupVencordPluginEstimator() {
        // Description
        document.getElementById('vencord-description').addEventListener('input', function() {
            estimatorState.description = this.value;
            updateSubmitButtonState();
            calculateVencordPluginPrice();
        });
        
        // Plugin type
        document.getElementById('vencord-type').addEventListener('change', function() {
            estimatorState.botType = this.value;
            updateSubmitButtonState();
            calculateVencordPluginPrice();
        });
        
        // Features
        const vencordFeaturesContainer = document.getElementById('vencord-features');
        const vencordFeatures = [
            { id: 'uiModifications', label: 'UI Modifications', price: 20 },
            { id: 'messageEnhancements', label: 'Message Enhancements', price: 15 },
            { id: 'themeIntegration', label: 'Theme Integration', price: 25 },
            { id: 'customButtons', label: 'Custom Buttons/Controls', price: 30 },
            { id: 'dataExport', label: 'Data Export Features', price: 20 },
            { id: 'apiIntegration', label: 'API Integration', price: 35 }
        ];
        
        vencordFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'price-estimator-feature-item';
            featureElement.innerHTML = `
                <input type="checkbox" id="vencord-${feature.id}">
                <label for="vencord-${feature.id}">${feature.label}</label>
                <span class="price-estimator-feature-price">+$${feature.price}</span>
            `;
            vencordFeaturesContainer.appendChild(featureElement);
            
            document.getElementById(`vencord-${feature.id}`).addEventListener('change', function() {
                if (this.checked) {
                    if (!estimatorState.features.includes(feature.id)) {
                        estimatorState.features.push(feature.id);
                    }
                } else {
                    estimatorState.features = estimatorState.features.filter(f => f !== feature.id);
                }
                calculateVencordPluginPrice();
            });
        });
        
        // Complexity level
        const complexitySlider = document.getElementById('vencord-complexity-slider');
        const complexityValue = document.getElementById('vencord-complexity-value');
        
        complexitySlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            complexityValue.textContent = `Level ${value}`;
            estimatorState.slashCommands = value;
            calculateVencordPluginPrice();
        });
        
        // Submit button
        document.getElementById('submit-vencord').addEventListener('click', showSummaryModal);
    }

    // Setup Discord Web estimator
    function setupDiscordWebEstimator() {
        // Description
        document.getElementById('web-description').addEventListener('input', function() {
            estimatorState.description = this.value;
            updateSubmitButtonState();
            calculateDiscordWebPrice();
        });
        
        // Application type
        document.getElementById('web-type').addEventListener('change', function() {
            estimatorState.botType = this.value;
            updateSubmitButtonState();
            calculateDiscordWebPrice();
        });
        
        // Pages count
        const pagesSlider = document.getElementById('web-pages-slider');
        const pagesInput = document.getElementById('web-pages-input');
        
        pagesSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            pagesInput.value = value;
            estimatorState.slashCommands = value;
            calculateDiscordWebPrice();
        });
        
        pagesInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 1;
            value = Math.max(1, Math.min(20, value));
            this.value = value;
            pagesSlider.value = value;
            estimatorState.slashCommands = value;
            calculateDiscordWebPrice();
        });
        
        // Features
        const webFeaturesContainer = document.getElementById('web-features');
        const webFeatures = [
            { id: 'responsiveDesign', label: 'Responsive Design', price: 40 },
            { id: 'userAuthentication', label: 'User Authentication (Discord OAuth)', price: 50 },
            { id: 'realTimeUpdates', label: 'Real-time Updates', price: 60 },
            { id: 'customDashboard', label: 'Custom Dashboard', price: 80 },
            { id: 'apiIntegration', label: 'Discord API Integration', price: 45 },
            { id: 'database', label: 'Database Integration', price: 55 }
        ];
        
        webFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'price-estimator-feature-item';
            featureElement.innerHTML = `
                <input type="checkbox" id="web-${feature.id}">
                <label for="web-${feature.id}">${feature.label}</label>
                <span class="price-estimator-feature-price">+$${feature.price}</span>
            `;
            webFeaturesContainer.appendChild(featureElement);
            
            document.getElementById(`web-${feature.id}`).addEventListener('change', function() {
                if (this.checked) {
                    if (!estimatorState.features.includes(feature.id)) {
                        estimatorState.features.push(feature.id);
                    }
                } else {
                    estimatorState.features = estimatorState.features.filter(f => f !== feature.id);
                }
                calculateDiscordWebPrice();
            });
        });
        
        // Technology stack
        document.getElementById('web-tech-stack').addEventListener('change', function() {
            estimatorState.deliveryPreference = this.value;
            calculateDiscordWebPrice();
        });
        
        // Hosting setup
        document.getElementById('web-hosting-setup').addEventListener('change', function() {
            estimatorState.hostingSetup = this.checked;
            calculateDiscordWebPrice();
        });
        
        // Submit button
        document.getElementById('submit-web').addEventListener('click', showSummaryModal);
    }

    // Setup modal
    function setupModal() {
        // Copy summary button
        document.getElementById('copy-summary').addEventListener('click', function() {
            const summary = document.getElementById('summary-content').textContent;
            navigator.clipboard.writeText(summary).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                        <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    Copied!
                `;
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
        
        // Close modal button
        document.getElementById('close-modal').addEventListener('click', function() {
            document.getElementById('summary-modal').classList.add('hidden');
        });
    }

    function goBackToSelection() {
        document.getElementById('estimator-views').classList.add('hidden');
        document.querySelectorAll('#estimator-views > div').forEach(div => {
            div.classList.add('hidden');
        });
        document.getElementById('card-selection-view').classList.remove('hidden');
        selectedCard = null;
    }

    function resetEstimatorState() {
        estimatorState = {
            botType: 'basic',  // Set a default bot type
            slashCommands: 5,  // Default value
            messageCommands: 0,  // Default value
            features: [],
            customStatus: false,
            customColor: '#000000',
            autoresponder: false,
            autoresponders: [],
            autoresponderCount: 0,
            autoresponderPlaceholders: false,
            apiIntegrations: false,
            hostingSetup: false,
            readmeFile: false,
            walkthrough: false,
            aiIntegration: false,
            deliveryPreference: 'standard'
        };    // Reset all inputs based on the selected card
        if (selectedCard === 'discordBot') {
            document.getElementById('bot-description').value = '';
            document.getElementById('bot-type').value = '';
            document.getElementById('slash-commands-slider').value = 5;
            document.getElementById('slash-commands-input').value = 5;
            document.getElementById('slash-commands-value').textContent = '5';
            document.getElementById('message-commands-slider').value = 0;
            document.getElementById('message-commands-input').value = 0;
            document.getElementById('message-commands-value').textContent = '0';
            document.getElementById('autoresponder').checked = false;
            document.querySelectorAll('#bot-features input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.getElementById('ai-integration-checkbox').checked = false;
            document.getElementById('ai-integration-input-container').classList.add('hidden');
            document.getElementById('ai-integration-input').value = '';
            document.getElementById('custom-status').value = '';
            document.getElementById('custom-status-type').value = 'playing';
            document.getElementById('custom-color').value = '#000000';
            document.getElementById('delivery-preference').value = 'standard';
            document.getElementById('api-integrations').value = '';
            document.getElementById('hosting-setup').checked = false;
            document.getElementById('readme-file').checked = false;
            document.getElementById('walkthrough').checked = false;
            document.getElementById('estimated-price').textContent = '$0';
            document.getElementById('estimated-time').textContent = 'TBD';
            document.getElementById('submit-bot').disabled = true;
        } else if (selectedCard === 'selfbot') {
            document.getElementById('selfbot-description').value = '';
            document.getElementById('selfbot-type').value = '';
            document.querySelectorAll('#selfbot-features input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.getElementById('selfbot-estimated-price').textContent = '$0';
            document.getElementById('submit-selfbot').disabled = true;
        } else if (selectedCard === 'vencordPlugin') {
            document.getElementById('vencord-description').value = '';
            document.getElementById('vencord-type').value = '';
            document.querySelectorAll('#vencord-features input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.getElementById('vencord-complexity-slider').value = 1;
            document.getElementById('vencord-complexity-value').textContent = 'Level 1';
            document.getElementById('vencord-estimated-price').textContent = '$0';
            document.getElementById('submit-vencord').disabled = true;
        } else if (selectedCard === 'discordWeb') {
            document.getElementById('web-description').value = '';
            document.getElementById('web-type').value = '';
            document.getElementById('web-pages-slider').value = 1;
            document.getElementById('web-pages-input').value = 1;
            document.querySelectorAll('#web-features input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.getElementById('web-tech-stack').value = 'react';
            document.getElementById('web-hosting-setup').checked = false;
            document.getElementById('web-estimated-price').textContent = '$0';
            document.getElementById('submit-web').disabled = true;
        }
    }

    function updateEstimatorUI() {
        if (selectedCard === 'discordBot') {
            // Initialize Discord Bot UI
            document.getElementById('slash-commands-slider').addEventListener('input', function() {
                const value = this.value;
                document.getElementById('slash-commands-value').textContent = value;
                updatePrice();
            });

            document.getElementById('message-commands-slider').addEventListener('input', function() {
                const value = this.value;
                document.getElementById('message-commands-value').textContent = value;
                updatePrice();
            });
            
            // Toggle event listeners for extras
            const extrasCheckboxes = ['hosting-setup', 'readme-file', 'walkthrough'];
            extrasCheckboxes.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.addEventListener('change', function() {
                        estimatorState[id.replace('-', '')] = this.checked;
                        updatePrice();
                    });
                }
            });

            // Autoresponder toggle
            document.getElementById('autoresponder').addEventListener('change', function() {
                updatePrice();
            });
        } else if (selectedCard === 'vencordPlugin') {
            // Initialize Vencord Plugin UI
            document.getElementById('vencord-complexity-slider').value = 1;
            document.getElementById('vencord-complexity-value').textContent = 'Level 1';
        } else if (selectedCard === 'discordWeb') {
            // Initialize Discord Web UI
            document.getElementById('web-pages-slider').value = 1;
            document.getElementById('web-pages-input').value = 1;
            document.getElementById('web-tech-stack').value = 'react';
        }
    }

    function updateSubmitButtonState() {
        let isValid = estimatorState.description && estimatorState.botType;
        
        if (selectedCard === 'discordBot') {
            document.getElementById('submit-bot').disabled = !isValid;
        } else if (selectedCard === 'selfbot') {
            document.getElementById('submit-selfbot').disabled = !isValid;
        } else if (selectedCard === 'vencordPlugin') {
            document.getElementById('submit-vencord').disabled = !isValid;
        } else if (selectedCard === 'discordWeb') {
            document.getElementById('submit-web').disabled = !isValid;
        }
    }

    function calculateDiscordBotPrice() {
        console.log('--- calculateDiscordBotPrice ---');
        console.log('Full PRICING_CONFIG:', JSON.stringify(PRICING_CONFIG, null, 2));
        console.log('Current botType:', estimatorState.botType);
        
        const config = PRICING_CONFIG.discordBot;
        console.log('Using config:', {
            basePrice: config.basePrice,
            autoresponder: config.autoresponder,
            slashCommandPrice: config.slashCommandPrice,
            messageCommandPrice: config.messageCommandPrice
        });
        
        const basePrice = config.basePrice[estimatorState.botType] || 0;
        const complexityMultiplier = config.complexityMultiplier[estimatorState.botType] || 1;

        let total = basePrice * complexityMultiplier;
        console.log(`Base price (${estimatorState.botType}): $${basePrice} x ${complexityMultiplier} = $${basePrice * complexityMultiplier}`);
        
        total += estimatorState.slashCommands * config.slashCommandPrice;
        console.log(`Slash commands (${estimatorState.slashCommands}): $${estimatorState.slashCommands * config.slashCommandPrice}`);
        
        total += estimatorState.messageCommands * config.messageCommandPrice;
        console.log(`Message commands (${estimatorState.messageCommands}): $${estimatorState.messageCommands * config.messageCommandPrice}`);

        // Add feature costs
        if (estimatorState.features.length > 0) {
            console.log('Features:');
            const botFeatures = [
                { id: 'buttonsMenus', price: 15 },
                { id: 'modals', price: 20 },
                { id: 'detailedLogging', price: 25 },
                { id: 'levelingSystem', price: 40 },
                { id: 'databaseIntegration', price: 35 },
                { id: 'multiguildSupport', price: 30 },
                { id: 'aiIntegration', price: 75 }
            ];
            
            estimatorState.features.forEach(featureId => {
                const feature = botFeatures.find(f => f.id === featureId);
                if (feature) {
                    console.log(`- ${featureId}: $${feature.price}`);
                    total += feature.price;
                } else {
                    // Fallback to config.features for backward compatibility
                    const featureCost = config.features[featureId] || 0;
                    console.log(`- ${featureId}: $${featureCost}`);
                    total += featureCost;
                }
            });
        }

        // Add styling costs
        if (estimatorState.customStatus) {
            console.log(`Custom status: $${config.styling.customStatus}`);
            total += config.styling.customStatus;
        }
        if (estimatorState.customColor !== '#000000') {
            console.log(`Custom color: $${config.styling.customColor}`);
            total += config.styling.customColor;
        }

        // Add autoresponder costs if enabled
        if (estimatorState.autoresponder) {
            console.log('Autoresponder details:', {
                enabled: estimatorState.autoresponder,
                count: estimatorState.autoresponderCount,
                placeholders: estimatorState.autoresponderPlaceholders
            });
            
            console.log(`Autoresponder base price: $${config.autoresponder.basePrice}`);
            total += config.autoresponder.basePrice;
            
            // Add cost per autoresponder if we track the count
            if (estimatorState.autoresponderCount && estimatorState.autoresponderCount > 0) {
                const responderCost = estimatorState.autoresponderCount * config.autoresponder.perResponder;
                console.log(`Autoresponder cost (${estimatorState.autoresponderCount} x $${config.autoresponder.perResponder}): $${responderCost}`);
                total += responderCost;
            }
            
            // Add placeholders cost if enabled
            if (estimatorState.autoresponderPlaceholders) {
                console.log(`Placeholders: $${config.autoresponder.placeholders}`);
                total += config.autoresponder.placeholders || 0;
            }
        }

        // Add extras
        const hostingSetupCheckbox = document.getElementById('hosting-setup');
        const readmeFileCheckbox = document.getElementById('readme-file');
        const walkthroughCheckbox = document.getElementById('walkthrough');
        const apiIntegrationsTextarea = document.getElementById('api-integrations');
        
        // Add API integration cost if there's any text in the textarea
        if (apiIntegrationsTextarea && apiIntegrationsTextarea.value.trim() !== '') {
            console.log(`API Integration: $${config.extras.apiIntegration}`);
            total += config.extras.apiIntegration;
        }
        
        if (hostingSetupCheckbox && hostingSetupCheckbox.checked) {
            console.log(`Hosting Setup: $${config.extras.hostingSetup}`);
            total += config.extras.hostingSetup;
        }
        if (readmeFileCheckbox && readmeFileCheckbox.checked) {
            console.log(`Readme File: $${config.extras.readmeFile}`);
            total += config.extras.readmeFile;
        }
        if (walkthroughCheckbox && walkthroughCheckbox.checked) {
            console.log(`Walkthrough: $${config.extras.walkthrough}`);
            total += config.extras.walkthrough;
        }
        if (estimatorState.aiIntegration) {
            console.log(`AI Integration: $${config.features.aiIntegration}`);
            total += config.features.aiIntegration;
        }

        // Apply delivery multiplier
        const deliveryMultiplier = config.deliveryMultiplier[estimatorState.deliveryPreference] || 1;
        console.log(`Delivery multiplier (${estimatorState.deliveryPreference}): x${deliveryMultiplier}`);
        total *= deliveryMultiplier;

        const roundedTotal = Math.round(total);
        console.log(`Total before rounding: $${total}`);
        console.log(`Rounded total: $${roundedTotal}`);
        
        const priceElement = document.getElementById('estimated-price');
        if (priceElement) {
            priceElement.textContent = `$${roundedTotal}`;
        }
        
        // Update estimated time
        let estimatedTime = 'TBD';
        if (roundedTotal < 100) estimatedTime = '2 - 3 days';
        else if (roundedTotal < 200) estimatedTime = '3 - 5 days';
        else if (roundedTotal < 300) estimatedTime = '5 - 7 days';
        else estimatedTime = '7 - 10 days';
        
        document.getElementById('estimated-time').textContent = estimatedTime;
        console.log('--- End of calculateDiscordBotPrice ---');
        
        return roundedTotal;
    }

    function calculateSelfbotPrice() {
        let total = PRICING_CONFIG.selfbot.basePrice;
        estimatorState.features.forEach(feature => {
            total += PRICING_CONFIG.selfbot.features[feature] || 0;
        });
        if (estimatorState.botType === 'advanced') total *= 1.3;
        if (estimatorState.botType === 'premium') total *= 1.6;

        const roundedTotal = Math.round(total);
        document.getElementById('selfbot-estimated-price').textContent = `$${roundedTotal}`;
        return roundedTotal;
    }

    function calculateVencordPluginPrice() {
        let total = PRICING_CONFIG.vencordPlugin.basePrice;
        estimatorState.features.forEach(feature => {
            total += PRICING_CONFIG.vencordPlugin.features[feature] || 0;
        });
        total *= (1 + (estimatorState.slashCommands - 1) * 0.1);

        const roundedTotal = Math.round(total);
        document.getElementById('vencord-estimated-price').textContent = `$${roundedTotal}`;
        return roundedTotal;
    }

    function calculateDiscordWebPrice() {
        let total = PRICING_CONFIG.discordWeb.basePrice;
        total += estimatorState.slashCommands * 25;
        estimatorState.features.forEach(feature => {
            total += PRICING_CONFIG.discordWeb.features[feature] || 0;
        });
        if (estimatorState.hostingSetup) total += 75;
        if (estimatorState.deliveryPreference === 'nextjs') total *= 1.1;
        if (estimatorState.deliveryPreference === 'custom') total *= 1.2;

        const roundedTotal = Math.round(total);
        document.getElementById('web-estimated-price').textContent = `$${roundedTotal}`;
        return roundedTotal;
    }

    function getEstimatedTime(price) {
        if (selectedCard === 'discordBot') {
            if (price < 100) return '2 - 3 days';
            if (price < 200) return '3 - 5 days';
            if (price < 300) return '5 - 7 days';
            return '7 - 10 days';
        }
        if (selectedCard === 'selfbot') return '3 - 5 days';
        if (selectedCard === 'vencordPlugin') return '4 - 7 days';
        if (selectedCard === 'discordWeb') return '1 - 3 weeks';
        return 'TBD';
    }

    function generateSummary() {
        const price = (() => {
            if (selectedCard === 'discordBot') {
                return calculateDiscordBotPrice();
            } else if (selectedCard === 'selfbot') {
                return calculateSelfbotPrice();
            } else if (selectedCard === 'vencordPlugin') {
                return calculateVencordPluginPrice();
            } else if (selectedCard === 'discordWeb') {
                return calculateDiscordWebPrice();
            }
            return 0;
        })();

        const time = (() => {
            if (selectedCard === 'discordBot') return getEstimatedTime(price);
            if (selectedCard === 'selfbot') return '3 - 5 days';
            if (selectedCard === 'vencordPlugin') return '4 - 7 days';
            if (selectedCard === 'discordWeb') return '1 - 3 weeks';
            return 'TBD';
        })();

        const serviceType = (() => {
            if (selectedCard === 'discordBot') return 'DISCORD BOT';
            if (selectedCard === 'selfbot') return 'SELFBOT';
            if (selectedCard === 'vencordPlugin') return 'VENCORD PLUGIN';
            if (selectedCard === 'discordWeb') return 'DISCORD WEB APP';
            return 'SERVICE';
        })();
        
        let featuresList = '';
        if (estimatorState.features.length > 0) {
            featuresList = estimatorState.features.map(feature => {
                // Convert camelCase to normal text with spaces
                const formattedFeature = feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `- ${formattedFeature}`;
            }).join('\n');
        } else {
            featuresList = '- None';
        }
        
        let summary = `${serviceType} ESTIMATE GENERATED\n\n`;
        
        if (selectedCard === 'discordBot') {
            summary += `🧠 Type: ${estimatorState.botType ? estimatorState.botType.charAt(0).toUpperCase() + estimatorState.botType.slice(1) : 'Not specified'}\n\n`;
            summary += `⚙️ Slash Commands: ${estimatorState.slashCommands}\n`;
            summary += `✉️ Message Commands: ${estimatorState.messageCommands}\n`;
            summary += `🔁 Autoresponders: ${estimatorState.autoresponder ? 'Yes' : 'No'}\n\n`;
        } else if (selectedCard === 'discordWeb') {
            summary += `📄 Pages: ${estimatorState.slashCommands}\n`;
            summary += `🛠️ Technology: ${estimatorState.deliveryPreference || 'Not specified'}\n\n`;
        } else if (selectedCard === 'vencordPlugin') {
            summary += `🔧 Complexity Level: ${estimatorState.slashCommands}/10\n\n`;
        }
        
        summary += `📦 Features Included:\n${featuresList}\n\n`;
        summary += `💰 Estimated Price: $${price}\n\n`;
        summary += `⏳ Estimated Time: ${time}\n\n`;
        summary += `--------------------------------------\n\n`;
        summary += `📝 Your ${serviceType.toLowerCase()} description:\n`;
        summary += `${estimatorState.description}\n\n`;
        summary += `--------------------------------------\n\n`;
        summary += `📎 Copy and paste this ENTIRE summary, including your description, into the "Requirements" box when ordering on Fiverr or DMing me directly.`;
        
        return summary;
    }

    function showSummaryModal() {
        const summary = generateSummary();
        document.getElementById('summary-content').textContent = summary;
        document.getElementById('summary-modal').classList.remove('hidden');
    }

    // Initialize all components
    setupCardSelection();
    setupDiscordBotEstimator();
    setupSelfbotEstimator();
    setupVencordPluginEstimator();
    setupDiscordWebEstimator();
    
    // Setup modal functionality
    function showSummaryModal() {
        console.log('showSummaryModal called');
        const summary = generateSummary();
        console.log('Generated summary:', summary);
        
        const summaryContent = document.getElementById('summary-content');
        const summaryModal = document.getElementById('summary-modal');
        
        console.log('Summary content element:', summaryContent);
        console.log('Summary modal element:', summaryModal);
        
        if (!summaryContent || !summaryModal) {
            console.error('Required elements not found!');
            if (!summaryContent) console.error('summary-content element not found');
            if (!summaryModal) console.error('summary-modal element not found');
            return;
        }
        
        // Set the summary content with proper formatting
        summaryContent.textContent = summary;
        
        // Show the modal with smooth transition
        summaryModal.style.display = 'flex';
        summaryModal.style.opacity = '1';
        summaryModal.style.visibility = 'visible';
        
        // Prevent body from scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        console.log('Modal should now be visible');
        
        // Add click handler for copy button
        document.getElementById('copy-summary').onclick = function() {
            navigator.clipboard.writeText(summary).then(function() {
                const copyBtn = document.getElementById('copy-summary');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        };
        
        // Function to close the modal
        function closeModal() {
            const summaryModal = document.getElementById('summary-modal');
            summaryModal.style.opacity = '0';
            summaryModal.style.visibility = 'hidden';
            
            // Allow body to scroll again
            document.body.style.overflow = 'auto';
            
            // Remove the modal from display after transition
            setTimeout(() => {
                summaryModal.style.display = 'none';
            }, 200); // Match this with your CSS transition time
        }
        
        // Add click handler for close button
        document.getElementById('close-modal').onclick = closeModal;
        
        // Close when clicking outside the modal
        window.onclick = function(event) {
            const modal = document.getElementById('summary-modal');
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Close with Escape key
        document.addEventListener('keydown', function(event) {
            const modal = document.getElementById('summary-modal');
            if (event.key === 'Escape' && window.getComputedStyle(modal).display === 'flex') {
                closeModal();
            }
        });
    }
    
    // Make feature tiles clickable
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a feature item or inside one
        const featureItem = e.target.closest('.price-estimator-feature-item');
        if (!featureItem) return;
        
        // Find the checkbox inside the feature item
        const checkbox = featureItem.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        // Toggle the checkbox
        checkbox.checked = !checkbox.checked;
        
        // Trigger change event to update the state
        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
    });
}