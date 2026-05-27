document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous error
        errorMessage.classList.remove('show');
        
        // Add loading state
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            
            // For now, always show error since we don't have a real backend
            // In a real app, you would check credentials here
            errorMessage.classList.add('show');
            
            // Add a subtle shake animation to the panel
            const panel = document.querySelector('.glass-panel');
            panel.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 400,
                easing: 'ease-in-out'
            });
            
        }, 1500);
    });

    // Add subtle interactive micro-animations to inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Global callback for Google Sign-In
window.handleCredentialResponse = (response) => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.remove('show');
    
    // In a real application, you would send response.credential to your Cloudflare Worker here
    console.log("Encoded JWT ID token: " + response.credential);
    
    // Simulate sending to Cloudflare Worker
    fetch('https://backoffice.rui-candle.workers.dev/login/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => {
        if (res.ok) {
            // Redirect to backoffice dashboard
            errorMessage.style.color = '#10b981';
            errorMessage.style.borderLeftColor = '#10b981';
            errorMessage.style.background = 'rgba(16, 185, 129, 0.1)';
            errorMessage.textContent = 'Google Login Successful!';
            errorMessage.classList.add('show');
        } else {
            throw new Error('Authentication failed');
        }
    })
    .catch(error => {
        console.error('Error during Google Sign-In:', error);
        errorMessage.style.color = '';
        errorMessage.style.borderLeftColor = '';
        errorMessage.style.background = '';
        errorMessage.textContent = 'Google Authentication failed. Please try again.';
        errorMessage.classList.add('show');
    });
};
