
document.addEventListener('DOMContentLoaded', function() {

const signUpForm = document.querySelector('.signup-form');

if (signUpForm) {
    signUpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if(!validatePassword(password, confirmPassword)) {
            return; 
        }
        if(fullname === '' || email === '' || password === '' || confirmPassword === '') {
            //TODO : better Error Handling
            alert('Please fill all the fields');
            return;
        }
            const user = {
                fullname: fullname,
                email: email,
                password: password,
            };

        console.log(user);

        //send user to server
        fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if(response.ok) {
                alert('User created successfully');
            } else if(response.status === 409) {
                alert('User already exists');
            } else {
                throw new Error('Something went wrong in the server');
            }
        })
        .then(data => {
            if(data.success) {
                alert('User created successfully');
            } else {
                throw new Error('Something went wrong in the server');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function validatePassword(password, confirmPassword) {
    if(password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    return true;
}
});