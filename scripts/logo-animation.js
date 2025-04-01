// Logo animation on load
document.addEventListener('DOMContentLoaded', function() {
    const logoOutline = document.querySelector('.logo-circle-outline');
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
        logoOutline.classList.remove('success');
        
        // Force reflow to reset animation
        void bigLogo.offsetWidth;
        void logoOutline.offsetWidth;
        
        // Start animations
        bigLogo.classList.add('click-spin');
        logoOutline.classList.add('success');
        
        // Clean up after animations complete
        bigLogo.addEventListener('animationend', function() {
            bigLogo.classList.remove('click-spin');
            
            // Remove green glow when spin completes
            setTimeout(() => {
                logoOutline.classList.remove('success');
                logoOutline.style.background = '#555';
                logoOutline.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            }, 100);
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