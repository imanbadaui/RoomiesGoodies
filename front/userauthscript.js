//handling login
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const adminButton = document.getElementById("adminButton");
const createAccountButton = document.getElementById("createAccountButton");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const loginWelcomeMessage = document.getElementById("loginWelcomeMessage");

let xhrLoginAuth = new XMLHttpRequest();

//2 is a dummy value for testing.
let serverResponse = 2;
let isAdmin = false;

//send login data to backend to authenticate.
function sendLoginAuthRequest() {
    const usernameStr = username.value;
    const passwordStr = password.value;

    xhrLoginAuth.open("POST", "http://127.0.0.1:5000/login", true);
    xhrLoginAuth.setRequestHeader("Content-Type", "application/json");

    // Send the user authentication data as JSON
    xhrLoginAuth.send(JSON.stringify({ username: usernameStr, password: passwordStr }));
}

//receive data from backend to handle after authentication
function ReceiveLoginAuthResponse() {
    let response = JSON.parse(xhrLoginAuth.responseText);
    //both username and password are valid.
    if (response.message === "1") {
        //if user is also an admin.
        if (response.user_is_Admin) {
            isAdmin = true;
        }
        return 1;
    }
    //username is not registered in database.
    else if (response.message === "-1") {
        return -1;
    }
    //password is wrong.
    else if (response.message === "0") {
        return 0;
    }
}


/* if loginbutton: send request, recieve answer, redirect to profile.
if admin button: send request, receive answer, open admin template + when press grant */
//admin and user can login but only admin can go to admin page.
loginButton.addEventListener("click", function () {
    sendLoginAuthRequest();
    //check if data sent or not.
    xhrLoginAuth.onload = function () {
        if (xhrLoginAuth.status === 200) {
            serverResponse = ReceiveLoginAuthResponse();
            if (serverResponse == 1) {
                window.location.href = "profile.html";
            } else if (serverResponse == -1) {
                loginErrorMessage.innerHTML = "<p> You're not a roomie. Enter a valid username. </p>";
            } else if (serverResponse == 0) {
                loginErrorMessage.innerHTML = "<p> Oops! wrong password, try again. </p>";
            }
        } else {
            loginErrorMessage.innerHTML = "<p> An error occurred while logging in. Please try again. </p>";
        }
    }

});

adminButton.addEventListener("click", function () {
    sendLoginAuthRequest();
    xhrLoginAuth.onload = function () {
        if (xhrLoginAuth.status === 200) {
            serverResponse = ReceiveLoginAuthResponse();
            if (serverResponse == 1 && isAdmin) {
                window.location.href = "admin.html";
            } else if (serverResponse == -1) {
                loginErrorMessage.innerHTML = "<p> You're not a roomie. Enter a valid username. </p>";
            } else if (serverResponse == 0) {
                loginErrorMessage.innerHTML = "<p> Oops! wrong password, try again. </p>";
            } else if (!isAdmin) {
                loginErrorMessage.innerHTML = "<p> You're not Admin. You don't have access </p>";
            }
        } else {
            loginErrorMessage.innerHTML = "<p> An error occurred while logging in. Please try again. </p>";
        }
    }
  
});


createAccountButton.addEventListener("click", function(){
    window.location.href = "newaccount.html";
});


username.addEventListener("click", function(){
    loginWelcomeMessage.innerHTML = "<p> Ay Ay, Roomie!</p>";
});