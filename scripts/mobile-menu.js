// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'flex' || mobileMenu.style.display === 'block';
    
    if (isOpen) {
        mobileMenu.style.display = 'none';
        mobileMenuBtn.innerHTML = '☰';
    } else {
        mobileMenu.style.display = 'flex';
        mobileMenuBtn.innerHTML = '✕';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        mobileMenuBtn.innerHTML = '☰';
    });
});
