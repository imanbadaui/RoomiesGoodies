const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const newPasswordButton = document.getElementById("newPasswordButton");
const newPasswordConfirmMessage = document.getElementById("newPasswordConfirmMessage");
const rePassword = document.getElementById("rePassword");
const loader = document.getElementById("loader");

let xhrNewPasswordAuth = new XMLHttpRequest();

let grantedUsernameStr = ""
let newPasswordForRommie = "";
let repasswordValue = "";

//send password to the granted username to the DB
function sendNewAccountData() {
    //password for new user account
    grantedUsernameStr = grantedUsername.value;
    newPasswordForRommie = newRoomiePassword.value;

    xhrNewPasswordAuth.open("POST", "http://127.0.0.1:5000/newPassword", true);
    xhrNewPasswordAuth.setRequestHeader("Content-Type", "application/json");
    // Send the new password and granted username data as JSON
    xhrNewPasswordAuth.send(JSON.stringify({ grantedUsername: grantedUsernameStr, newPassword: newPasswordForRommie }));
}

newPasswordButton.addEventListener("click", function () {
    newPasswordForRommie = newRoomiePassword.value;
    repasswordValue = rePassword.value;
    //if reenter password value matches the value of the new password.
    if (newPasswordForRommie == repasswordValue) {
        sendNewAccountData();
        xhrNewPasswordAuth.onload = function () {
            if (xhrNewPasswordAuth.status === 200) {
                console.log(grantedUsername.value);
                let response = JSON.parse(xhrNewPasswordAuth.responseText);
                if (response.message === "1") {
                    newPasswordConfirmMessage.innerHTML = "<p> Password updated Successfully.</p>";
                    loader.style.display = 'inline-block';
                    //sleep for 5 seconds before redirection
                    setTimeout(function () {
                        loader.style.display = 'none';
                        window.location.href = "homepage.html";
                    }, 2000);

                } else if (response.message === "-1") {
                    newPasswordConfirmMessage.innerHTML = "<p> This username doesn't exist. </p>";
                }
                else if(response.message === "0"){
                    newPasswordConfirmMessage.innerHTML = "<p> Please enter username and password. </p>";
                }
            } else {
                newPasswordConfirmMessage.innerHTML = "<p> An error occurred while storing new password. Please try again. </p>";
            }
        }
    } else {
        newPasswordConfirmMessage.innerHTML = "<p> Please enter matching passwords. </p>";
    }

    grantedUsername.innerText = "";
    newRoomiePassword.innerText = "";
    rePassword.innerText = "";
});