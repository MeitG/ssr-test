document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
});

/**
 * Loads the navbar and sets up its functionality
 */
function loadNavbar() {
    fetch('/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Insert the navbar at the beginning of the body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Setup navbar state after it's loaded
            updateNavbarLoginState();
            highlightActivePage();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            // Could add fallback navbar or error message to user here
        });
}

/**
 * Updates navbar elements based on login state
 */
async function updateNavbarLoginState() {
    const isUserLoggedIn = await isLoggedIn();
    console.log("isUserLoggedIn", isUserLoggedIn);
    // Get navigation elements
    const loginNav = document.getElementById('nav-login');
    const signupNav = document.getElementById('nav-signup');
    const profileNav = document.getElementById('nav-profile');
    
    if (loginNav) loginNav.parentElement.classList.toggle('hidden', isUserLoggedIn);
    if (signupNav) signupNav.parentElement.classList.toggle('hidden', isUserLoggedIn);
    if (profileNav) profileNav.parentElement.classList.toggle('hidden', !isUserLoggedIn);
}

/**
 * Highlights the active page in the navbar
 */
function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navMap = {
        '': 'nav-home',
        'index': 'nav-home',
        'about': 'nav-about',
        'contact': 'nav-contact',
        'login': 'nav-login',
        'signup': 'nav-signup',
        'profile': 'nav-profile'
    };
    
    // Remove any existing active classes
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find which page we're on and highlight the appropriate nav item
    const pageKey = Object.keys(navMap).find(key => 
        (key === '' && (currentPath === '/' || currentPath === '')) || 
        (key !== '' && currentPath.includes(key))
    );
    
    if (pageKey && navMap[pageKey]) {
        const navElement = document.getElementById(navMap[pageKey]);
        if (navElement) {
            navElement.classList.add('active');
        }
    }
}


function isLoggedIn() {
    return fetch('/api/check-auth')
        .then(response => response.json())
        .then(data => {
            return data.success;
        })
        .catch(error => {
            console.error('Error checking auth:', error);
            return false;
        });
}





