document.addEventListener('DOMContentLoaded', function() {
    // Fetch the navbar HTML
    fetch('/navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insert the navbar at the beginning of the body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Highlight the active page based on the current URL
            const currentPath = window.location.pathname;
            
            if (currentPath === '/' || currentPath.includes('index')) {
                document.getElementById('nav-home').classList.add('active');
            } else if (currentPath.includes('about')) {
                document.getElementById('nav-about').classList.add('active');
            } else if (currentPath.includes('contact')) {
                document.getElementById('nav-contact').classList.add('active');
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
}); 