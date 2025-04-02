// Logo animation on load
document.addEventListener('DOMContentLoaded', function() {
    const logoOutline = document.querySelector('.logo-circle-outline');
    const logoMain = document.querySelector('.logo-circle-main');
    const bigLogo = document.querySelector('.big-logo');
    
    // Create and add the "Click me!" text
    const clickMeText = document.createElement('div');
    clickMeText.className = 'click-me-text';
    clickMeText.textContent = 'Click me!';
    logoOutline.appendChild(clickMeText);
    
    // Initial load animation
    bigLogo.classList.add('animate-spin');
    
    // Remove animation class after it completes
    bigLogo.addEventListener('animationend', function() {
        bigLogo.classList.remove('animate-spin');
    }, { once: true });
    
    // Click handler for logo
    logoOutline.addEventListener('click', function() {
        // Reset animations
        bigLogo.classList.remove('click-spin');
        logoOutline.classList.remove('glow');
        logoMain.classList.remove('glow');
        
        // Force reflow to reset animation
        void bigLogo.offsetWidth;
        void logoOutline.offsetWidth;
        void logoMain.offsetWidth;
        
        // Start animations
        bigLogo.classList.add('click-spin');
        logoOutline.classList.add('glow');
        logoMain.classList.add('glow');
        
        // Clean up after animations complete
        bigLogo.addEventListener('animationend', function() {
            bigLogo.classList.remove('click-spin');
        }, { once: true });
    });
    
    // Optional: Add a slight pulse effect on page load
    setTimeout(() => {
        logoOutline.style.transform = 'scale(1.05)';
        setTimeout(() => {
            logoOutline.style.transform = 'scale(1)';
        }, 300);
    }, 1000);
});