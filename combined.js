// Combined JavaScript for Vehicle Service Checklist PWA

// Import base functionality
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Service Record Form
    const serviceRecordForm = document.getElementById('service-record-form');
    const serviceRecordBody = document.getElementById('service-record-body');
    
    // Load records from localStorage
    loadServiceRecords();
    
    if (serviceRecordForm) {
        serviceRecordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('service-date').value;
            const vehicle = document.getElementById('service-vehicle').value;
            const mileage = document.getElementById('service-mileage').value;
            const servicePerformed = document.getElementById('service-performed').value;
            const nextService = document.getElementById('next-service').value;
            
            addServiceRecord(date, vehicle, mileage, servicePerformed, nextService);
            
            // Reset form
            serviceRecordForm.reset();
        });
    }
    
    // Function to add a service record
    function addServiceRecord(date, vehicle, mileage, servicePerformed, nextService) {
        // Create record object
        const record = {
            id: Date.now(),
            date: date,
            vehicle: vehicle,
            mileage: mileage,
            servicePerformed: servicePerformed,
            nextService: nextService
        };
        
        // Add to localStorage
        let records = getServiceRecords();
        records.push(record);
        localStorage.setItem('serviceRecords', JSON.stringify(records));
        
        // Add to table
        displayServiceRecord(record);
    }
    
    // Function to display a service record in the table
    function displayServiceRecord(record) {
        if (!serviceRecordBody) return;
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', record.id);
        
        row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${record.vehicle}</td>
            <td>${record.mileage}</td>
            <td>${record.servicePerformed}</td>
            <td>${record.nextService}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-record" data-id="${record.id}">Delete</button>
            </td>
        `;
        
        serviceRecordBody.appendChild(row);
        
        // Add event listener to delete button
        const deleteButton = row.querySelector('.delete-record');
        deleteButton.addEventListener('click', function() {
            deleteServiceRecord(this.getAttribute('data-id'));
        });
    }
    
    // Function to delete a service record
    function deleteServiceRecord(id) {
        // Remove from localStorage
        let records = getServiceRecords();
        records = records.filter(record => record.id != id);
        localStorage.setItem('serviceRecords', JSON.stringify(records));
        
        // Remove from table
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
    }
    
    // Function to get service records from localStorage
    function getServiceRecords() {
        const records = localStorage.getItem('serviceRecords');
        return records ? JSON.parse(records) : [];
    }
    
    // Function to load service records from localStorage
    function loadServiceRecords() {
        if (!serviceRecordBody) return;
        
        const records = getServiceRecords();
        records.forEach(record => {
            displayServiceRecord(record);
        });
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Print functionality
    const printButton = document.createElement('button');
    printButton.classList.add('btn');
    printButton.style.position = 'fixed';
    printButton.style.bottom = '20px';
    printButton.style.right = '20px';
    printButton.style.zIndex = '99';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Checklist';
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);

    // iOS-specific enhancements
    
    // Detect iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true;
    
    // Add offline indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.textContent = 'You are offline. Using cached data.';
    document.body.prepend(offlineIndicator);
    
    // Check online status
    function updateOnlineStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            
            // Show online notification
            const statusElement = document.createElement('div');
            statusElement.className = 'connection-status online';
            statusElement.textContent = 'You are back online';
            document.body.appendChild(statusElement);
            
            setTimeout(() => {
                statusElement.classList.add('show');
                setTimeout(() => {
                    statusElement.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(statusElement);
                    }, 300);
                }, 2000);
            }, 100);
        } else {
            document.body.classList.add('offline');
            
            // Show offline notification
            const statusElement = document.createElement('div');
            statusElement.className = 'connection-status offline';
            statusElement.textContent = 'You are offline. Using cached data.';
            document.body.appendChild(statusElement);
            
            setTimeout(() => {
                statusElement.classList.add('show');
                setTimeout(() => {
                    statusElement.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(statusElement);
                    }, 300);
                }, 2000);
            }, 100);
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
    
    // Add splash screen for standalone mode
    if (isStandalone) {
        document.body.classList.add('standalone-mode');
        
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
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                document.body.removeChild(splashScreen);
            }, 500);
        }, 1500);
    }
    
    // Show installation instructions for iOS
    if (isIOS && !isStandalone) {
        const installSection = document.getElementById('install-instructions');
        if (installSection) {
            installSection.style.display = 'block';
        }
        
        // Show install banner if not already dismissed
        const bannerDismissed = localStorage.getItem('installBannerDismissed');
        
        if (!bannerDismissed) {
            const installBanner = document.createElement('div');
            installBanner.className = 'install-banner';
            installBanner.innerHTML = `
                <div>
                    <strong>Install this app on your iPhone!</strong>
                    <p>Tap <i class="fas fa-share-square"></i> and then "Add to Home Screen"</p>
                </div>
                <button class="close-btn">&times;</button>
            `;
            
            document.body.appendChild(installBanner);
            
            // Show banner after a delay
            setTimeout(() => {
                installBanner.classList.add('show');
            }, 3000);
            
            // Add event listener to close button
            const closeBtn = installBanner.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                installBanner.classList.remove('show');
                localStorage.setItem('installBannerDismissed', 'true');
                setTimeout(() => {
                    document.body.removeChild(installBanner);
                }, 300);
            });
        }
    }
    
    // Add pull-to-refresh functionality for iOS
    if (isIOS) {
        const pullToRefresh = document.createElement('div');
        pullToRefresh.className = 'pull-to-refresh';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        pullToRefresh.appendChild(spinner);
        document.body.prepend(pullToRefresh);
        
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            
            // Only trigger if at top of page and pulling down
            if (window.scrollY === 0 && touchEndY > touchStartY && touchEndY - touchStartY > 70) {
                pullToRefresh.classList.add('visible');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (pullToRefresh.classList.contains('visible')) {
                // Simulate refresh
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }, { passive: true });
    }
    
    // Prevent iOS overscroll/bounce effect
    document.body.addEventListener('touchmove', (e) => {
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
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
