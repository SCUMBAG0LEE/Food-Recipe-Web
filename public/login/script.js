document.querySelector('.img__btn').addEventListener('click', function() {
  document.querySelector('.cont').classList.toggle('s--signup');
});

function WIPFunction() {
  alert("That Feature Is Not Implemented Yet, Pls Try Another Method");
}

function FieldAlert() {
    alert("All fields are required");
    window.location.href = '/auth';
}

function RegisterYes() {
    alert("Registration Successful");
    window.location.href = '/auth';
}

function Register1() {
    alert("User already exists");
    window.location.href = '/auth';
}

function RegisterNo() {
    alert("An error occurred while registering");
    window.location.href = '/auth';
}

function Login1() {
    alert("Invalid email/username or password");
    window.location.href = '/auth';
}

function LoginYes() {
    alert("Login Successful");
    window.location.href = '/';
}

function LoginNo() {
    alert("An error occurred while logging in");
    window.location.href = '/auth';
}

function Login2() {
    alert("Logout First Before Trying To Authenticate Again");
    window.location.href = '/';
}

