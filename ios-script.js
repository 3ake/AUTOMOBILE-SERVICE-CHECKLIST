// iOS-specific enhancements for Vehicle Service Checklist PWA

// Add iOS splash screen functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create splash screen element if in standalone mode
    if (window.navigator.standalone === true) {
        const splashScreen = document.createElement('div');
        splashScreen.className = 'splash-screen';
        
        const splashContent = document.createElement('div');
        splashContent.className = 'splash-content';
        
        const splashIcon = document.createElement('div');
        splashIcon.className = 'splash-icon';
        splashIcon.innerHTML = '<i class="fas fa-car"></i>';
        
        const splashTitle = document.createElement('div');
        splashTitle.className = 'splash-title';
        splashTitle.textContent = 'Vehicle Service Checklist';
        
        const splashSubtitle = document.createElement('div');
        splashSubtitle.className = 'splash-subtitle';
        splashSubtitle.textContent = 'Loading your maintenance schedules...';
        
        splashContent.appendChild(splashIcon);
        splashContent.appendChild(splashTitle);
        splashContent.appendChild(splashSubtitle);
        splashScreen.appendChild(splashContent);
        
        document.body.appendChild(splashScreen);
        
        // Hide splash screen after a delay
        setTimeout(function() {
            splashScreen.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(function() {
                document.body.removeChild(splashScreen);
            }, 500);
        }, 1500);
    }
    
    // Detect iOS device and show installation instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true;
    
    if (isIOS && !isStandalone) {
        const installSection = document.getElementById('install-instructions');
        if (installSection) {
            installSection.style.display = 'block';
        }
    }
    
    // Prevent iOS overscroll/bounce effect
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.table-responsive, .accordion-content')) {
            // Allow scrolling within these elements
            const element = e.target.closest('.table-responsive, .accordion-content');
            const scrollTop = element.scrollTop;
            const scrollHeight = element.scrollHeight;
            const height = element.clientHeight;
            
            if ((scrollTop === 0 && e.touches[0].clientY > 0) || 
                (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
                e.preventDefault();
            }
        } else if (!e.target.closest('.table-responsive, .accordion-content')) {
            // Prevent overscroll on body
            if (document.body.scrollTop === 0 && e.touches[0].clientY > 0) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // Add active state for buttons on iOS
    const buttons = document.querySelectorAll('button, .btn, .accordion-header');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
});

// Handle iOS PWA offline status
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusElement = document.createElement('div');
    statusElement.className = 'connection-status';
    
    if (navigator.onLine) {
        statusElement.textContent = 'You are back online';
        statusElement.classList.add('online');
    } else {
        statusElement.textContent = 'You are offline. Using cached data.';
        statusElement.classList.add('offline');
    }
    
    document.body.appendChild(statusElement);
    
    setTimeout(function() {
        statusElement.classList.add('show');
        
        setTimeout(function() {
            statusElement.classList.remove('show');
            setTimeout(function() {
                document.body.removeChild(statusElement);
            }, 300);
        }, 2000);
    }, 100);
}

// Check if app was launched from home screen
if (window.navigator.standalone === true) {
    console.log('App launched from home screen');
    // Add class to body for app-specific styling
    document.body.classList.add('standalone-mode');
}
