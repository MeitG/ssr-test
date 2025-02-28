document.addEventListener('DOMContentLoaded', () => {
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
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        logout()
    });
});

function logout() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
}