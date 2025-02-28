document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        logout()
    });
});

function logout() {
    fetch('/api/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}

function getProfile() {
    fetch('/api/profile')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const fullnameElement = document.getElementById('user-fullname');
        const emailElement = document.getElementById('user-email');
        fullnameElement.textContent = data.user.fullname;
        emailElement.textContent = data.user.email;
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}