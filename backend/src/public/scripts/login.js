
document.addEventListener('DOMContentLoaded' , (e) => {
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener("submit" , (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const normilizedEmail = email.toLowerCase().trim();
        const loginCredentials = {email : normilizedEmail , password : password}
        fetch("/api/login" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                switch (response.status) {
                    case 400:
                        throw new Error('Bad request. Please check your input.');
                    case 401:
                        throw new Error('Invalid username or password.');
                    case 500:
                        throw new Error('Server error. Please try again later.');
                    default:
                        throw new Error('Something went wrong. Please try again.');
                }
            }
        })
        .then(data => {
            console.log('Login successful:', data);
        })
        .catch(error => {
            console.error('Login error:', error);
        });
    });
});