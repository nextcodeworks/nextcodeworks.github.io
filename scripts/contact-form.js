// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 5000);
            } finally {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Handle URL parameter for successful form submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('form-submitted')) {
        successMessage.style.display = 'block';
        
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    // Handle "View Services" button click
    const viewServicesBtn = document.getElementById('viewServicesBtn');
    if (viewServicesBtn) {
        viewServicesBtn.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});