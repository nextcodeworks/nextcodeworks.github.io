document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const reviewsContainer = document.querySelector('.reviews-container');
    
    // State
    let currentIndex = 0;
    let reviews = [];
    
    // Fetch reviews from JSON file
    async function fetchReviews() {
        try {
            const response = await fetch('reviews.json');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            reviews = data.reviews;
            renderReviews();
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Fallback to empty array if fetch fails
            reviews = [];
        }
    }
    
    // Render star rating
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5 && rating % 1 < 1;
        let starsHTML = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star full">★</span>';
        }
        
        // Add half star if needed
        if (hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        }
        
        // Add empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">★</span>';
        }
        
        return starsHTML;
    }
    
    // Format rating display (5.0 -> 5, 4.7 -> 4.7)
    function formatRating(rating) {
        return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
    }
    
    // Truncate text to fit available space and add 'See more' link
    function formatReviewText(text, maxLength = 300) { 
        if (text.length <= maxLength) return text;
        // Find the last space before maxLength to avoid cutting words
        let truncated = text.substr(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            truncated = truncated.substr(0, lastSpace);
        }
        return `${truncated}...`;
    }
    
    // Check if text needs to be truncated
    function needsTruncation(text, maxLength = 300) {
        return text.length > maxLength;
    }
    
    // Map country names to ISO 3166-1 alpha-2 country codes for flags
    function getCountryFlagCode(country) {
        const countryMap = {
            // Common countries
            'united states': 'us',
            'usa': 'us',
            'united kingdom': 'gb',
            'uk': 'gb',
            'germany': 'de',
            'france': 'fr',
            'spain': 'es',
            'italy': 'it',
            'netherlands': 'nl',
            'australia': 'au',
            'canada': 'ca',
            'japan': 'jp',
            'south korea': 'kr',
            'russia': 'ru',
            'brazil': 'br',
            'mexico': 'mx',
            'india': 'in',
            'china': 'cn',
            'sweden': 'se',
            'norway': 'no',
            'denmark': 'dk',
            'finland': 'fi',
            'poland': 'pl',
            'switzerland': 'ch',
            'austria': 'at',
            'belgium': 'be',
            'portugal': 'pt',
            'greece': 'gr',
            'turkey': 'tr',
            'egypt': 'eg',
            'south africa': 'za',
            'new zealand': 'nz',
            'singapore': 'sg',
            'malaysia': 'my',
            'thailand': 'th',
            'vietnam': 'vn',
            'indonesia': 'id',
            'philippines': 'ph',
            'saudi arabia': 'sa',
            'united arab emirates': 'ae',
            'israel': 'il'
            // Add more countries as needed
        };
        
        const normalizedCountry = country.toLowerCase().trim();
        return countryMap[normalizedCountry] || 'globe'; // 'globe' as fallback
    }

    // Create review card HTML
    function createReviewCard(review, position) {
        const maxLength = 350; // Increased to show more text
        const needsMore = needsTruncation(review.review, maxLength);
        const displayText = needsMore ? formatReviewText(review.review, maxLength) : review.review;
        const flagCode = getCountryFlagCode(review.country);
        
        return `
            <div class="review-card ${position}">
                <div class="review-top-section">
                    <div class="review-header">
                        <img src="${review.logo}" alt="${review.platform} Logo" class="review-logo">
                        <div class="reviewer-info">
                            <div class="reviewer-name-wrapper">
                                <h4 class="reviewer-name">${review.name}</h4>
                                ${review.isRepeatClient ? '<span class="reviewer-badge">•&nbsp; Repeat Client</span>' : ''}
                            </div>
                            <p class="reviewer-country">
                                <span class="fi fi-${flagCode}"></span>
                                ${review.country}
                            </p>
                        </div>
                    </div>
                    <div class="review-divider"></div>
                    <div class="review-stars">
                        ${renderStars(review.stars)}
                        <span class="rating">${formatRating(review.stars)}</span>
                    </div>
                    <div class="review-content">
                        ${displayText}
                        ${needsMore ? `<a href="https://www.fiverr.com/nextcodeworks?source=gig_page" target="_blank" class="read-more">See more</a>` : ''}
                    </div>
                </div>
                
                <div class="review-meta">
                    <div class="review-details">
                        <div class="review-price">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <span>${review.price}</span>
                        </div>
                        <div class="review-duration">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>${review.duration}</span>
                        </div>
                    </div>
                    <a href="https://www.fiverr.com/nextcodeworks?source=gig_page" target="_blank" class="custom-button secondary">
                        View on ${review.platform}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }
    
    // Render reviews in the carousel
    function renderReviews() {
        if (reviews.length === 0) return;
        
        // Clear container
        reviewsContainer.innerHTML = '';
        
        // Calculate previous and next indices
        const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        const nextIndex = (currentIndex + 1) % reviews.length;
        
        // Create and append review cards
        const prevReview = createReviewCard(reviews[prevIndex], 'left');
        const currentReview = createReviewCard(reviews[currentIndex], 'center');
        const nextReview = createReviewCard(reviews[nextIndex], 'right');
        
        reviewsContainer.innerHTML = prevReview + currentReview + nextReview;
        
        // Add hidden cards for the rest of the reviews
        const remainingReviews = reviews.filter((_, index) => 
            index !== prevIndex && index !== currentIndex && index !== nextIndex
        );
        
        remainingReviews.forEach(review => {
            const hiddenReview = document.createElement('div');
            hiddenReview.className = 'review-card hidden';
            hiddenReview.innerHTML = createReviewCard(review, 'hidden');
            reviewsContainer.appendChild(hiddenReview);
        });

        // Update pagination indicators
        updatePaginationIndicators();
    }

    // Update pagination indicators
    function updatePaginationIndicators() {
        const indicatorsContainer = document.querySelector('.pagination-indicators');
        if (!indicatorsContainer) return;
        
        // Remove previous active class from all indicators
        document.querySelectorAll('.pagination-indicator').forEach(indicator => {
            if (indicator.classList.contains('active')) {
                indicator.classList.remove('active');
                indicator.classList.add('previous-active');
                
                // Remove the previous-active class after animation completes
                setTimeout(() => {
                    indicator.classList.remove('previous-active');
                }, 300); // Match this with the animation duration
            }
        });
        
        // If this is the initial load, create all indicators
        if (indicatorsContainer.children.length === 0) {
            indicatorsContainer.innerHTML = ''; // Clear existing indicators
            
            reviews.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'pagination-indicator';
                if (index === currentIndex) {
                    // Small delay to ensure the element is in the DOM before adding active class
                    setTimeout(() => {
                        indicator.classList.add('active');
                    }, 50);
                }
                indicator.addEventListener('click', () => {
                    if (!indicator.classList.contains('active')) {
                        currentIndex = index;
                        renderReviews();
                    }
                });
                indicatorsContainer.appendChild(indicator);
            });
        } else {
            // Just update the active state for existing indicators
            const indicators = indicatorsContainer.querySelectorAll('.pagination-indicator');
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                    indicator.classList.remove('previous-active');
                }
            });
        }
    }
    
    // Go to next review
    function nextReview() {
        currentIndex = (currentIndex + 1) % reviews.length;
        renderReviews();
    }
    
    // Go to previous review
    function prevReview() {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        renderReviews();
    }
    
    // Handle card clicks
    function handleCardClicks() {
        const leftCard = document.querySelector('.review-card.left');
        const rightCard = document.querySelector('.review-card.right');
        
        if (leftCard) {
            leftCard.addEventListener('click', prevReview);
        }
        
        if (rightCard) {
            rightCard.addEventListener('click', nextReview);
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextReview();
        } else if (e.key === 'ArrowLeft') {
            prevReview();
        }
    });
    
    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    reviewsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    reviewsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance to trigger swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                prevReview();
            } else {
                // Swipe left - go to next
                nextReview();
            }
        }
    }
    
    // Auto-rotation variables
    let rotationInterval;
    const ROTATION_INTERVAL_MS = 6000; // 6 seconds
    
    // Start auto-rotation
    function startAutoRotation() {
        // Clear any existing interval to prevent multiple intervals running
        stopAutoRotation();
        // Start new interval
        rotationInterval = setInterval(() => {
            nextReview();
        }, ROTATION_INTERVAL_MS);
    }
    
    // Stop auto-rotation
    function stopAutoRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    }
    
    // Pause auto-rotation when user interacts with the carousel
    function handleUserInteraction() {
        stopAutoRotation();
        // Restart rotation after a delay
        setTimeout(startAutoRotation, ROTATION_INTERVAL_MS * 2);
    }
    
    // Initialize
    fetchReviews().then(() => {
        handleCardClicks();
        startAutoRotation();
    });
    
    // Re-attach event listeners after re-rendering
    const originalRenderReviews = renderReviews;
    renderReviews = function() {
        originalRenderReviews.apply(this, arguments);
        handleCardClicks();
    };
    
    // Pause auto-rotation on user interaction
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            handleUserInteraction();
        }
    });
    
    // Also pause on card clicks
    document.querySelector('.reviews-carousel')?.addEventListener('click', handleUserInteraction);
    
    // Pause auto-rotation when window loses focus
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoRotation();
        } else {
            startAutoRotation();
        }
    });
});
