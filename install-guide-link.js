// Add link to installation guide in the main index.html
document.addEventListener('DOMContentLoaded', function() {
    // Create installation guide link
    const installGuideLink = document.createElement('a');
    installGuideLink.href = 'installation.html';
    installGuideLink.className = 'install-guide-link';
    installGuideLink.innerHTML = '<i class="fas fa-download"></i> Installation Guide';
    installGuideLink.style.position = 'fixed';
    installGuideLink.style.bottom = '20px';
    installGuideLink.style.left = '20px';
    installGuideLink.style.zIndex = '99';
    installGuideLink.style.backgroundColor = '#2ecc71';
    installGuideLink.style.color = 'white';
    installGuideLink.style.padding = '10px 15px';
    installGuideLink.style.borderRadius = '4px';
    installGuideLink.style.textDecoration = 'none';
    installGuideLink.style.fontWeight = '500';
    installGuideLink.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    
    // Only show on iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.body.appendChild(installGuideLink);
    }
});
