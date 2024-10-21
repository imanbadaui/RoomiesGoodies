const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const createButton = document.getElementById("createButton");
const newAccountConfirmMessage = document.getElementById("newAccountConfirmMessage");
const rePassword = document.getElementById("rePassword");
const loader = document.getElementById("loader");

let xhrNewAccountAuth = new XMLHttpRequest();

let grantedUsernameStr = ""
let newPasswordForRommie = "";
let repasswordValue = "";

//send password to the granted username to the DB
function sendNewAccountData() {
    //password for new user account
    grantedUsernameStr = grantedUsername.value;
    newPasswordForRommie = newRoomiePassword.value;

    xhrNewAccountAuth.open("POST", "http://127.0.0.1:5000/newAccount", true);
    xhrNewAccountAuth.setRequestHeader("Content-Type", "application/json");
    // Send the new password and granted username data as JSON
    xhrNewAccountAuth.send(JSON.stringify({ grantedUsername: grantedUsernameStr, newPassword: newPasswordForRommie }));
}

createButton.addEventListener("click", function () {
    newPasswordForRommie = newRoomiePassword.value;
    repasswordValue = rePassword.value;
    //if reenter password value matches the value of the new password.
    if (newPasswordForRommie == repasswordValue) {
        sendNewAccountData();
        xhrNewAccountAuth.onload = function () {
            if (xhrNewAccountAuth.status === 200) {
                //console.log(grantedUsername.value);
                let response = JSON.parse(xhrNewAccountAuth.responseText);
                if (response.message === "1") {
                    newAccountConfirmMessage.innerHTML = "<p> Account created Successfully. Nice to have you home " + grantedUsername.value + "! </p>";
                    loader.style.display = 'inline-block';
                    //sleep for 5 seconds before redirection
                    setTimeout(function () {
                        loader.style.display = 'none';
                        window.location.href = "homepage.html";
                    }, 2000);
                }
                else if (response.message === "0") {
                    newAccountConfirmMessage.innerHTML = "<p> Please Enter a username and password. </p>";
                } else if (response.message === "-1") {
                    newAccountConfirmMessage.innerHTML = "<p> Account already created. </p>";
                }
            } else {
                newAccountConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
            }
        }
    } else {
        newAccountConfirmMessage.innerHTML = "<p> Please enter matching passwords. </p>";
    }

    grantedUsernameStr = "";
    newPasswordForRommie = "";
    repasswordValue = "";
});