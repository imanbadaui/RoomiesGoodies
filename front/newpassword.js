const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const newPasswordButton = document.getElementById("newPasswordButton");
const newPasswordConfirmMessage = document.getElementById("newPasswordConfirmMessage");
const rePassword = document.getElementById("rePassword");
const loader = document.getElementById("loader");
const secretWordInput = document.getElementById("secretWordInput");

let xhrNewPasswordAuth = new XMLHttpRequest();

let grantedUsernameStr = ""
let newPasswordForRommie = "";
let repasswordValue = "";
let secretWord = "";
//send password to the granted username to the DB
function sendNewAccountData() {
    //password for new user account
    grantedUsernameStr = grantedUsername.value;
    newPasswordForRommie = newRoomiePassword.value;
    secretWord = secretWordInput.value;
    xhrNewPasswordAuth.open("POST", "http://127.0.0.1:5000/newPassword", true);
    xhrNewPasswordAuth.setRequestHeader("Content-Type", "application/json");
    // Send the new password and granted username data as JSON
    xhrNewPasswordAuth.send(JSON.stringify({ grantedUsername: grantedUsernameStr, newPassword: newPasswordForRommie, secretWord: secretWord }));
}

newPasswordButton.addEventListener("click", function () {
    newPasswordForRommie = newRoomiePassword.value;
    repasswordValue = rePassword.value;
    secretWord = secretWordInput.value;
    if (grantedUsername.value == "") {
        newPasswordConfirmMessage.innerHTML = "<p> Please enter your username. </p>";
    } else if (newPasswordForRommie == "") {
        newPasswordConfirmMessage.innerHTML = "<p> Please enter your new password. </p>";
    } else if (repasswordValue == "") {
        newPasswordConfirmMessage.innerHTML = "<p> Please re-enter your new password. </p>";
    }else if(secretWord == ""){
        newPasswordConfirmMessage.innerHTML = "<p> Please enter your magic word. </p>";
    }
    else {
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
                    }else if(response.message === "-2"){
                        newPasswordConfirmMessage.innerHTML = "<p> Wrong magic word. </p>";
                    }
                } else {
                    newPasswordConfirmMessage.innerHTML = "<p> An error occurred while storing new password. Please try again. </p>";
                }
            }
        } else {
            newPasswordConfirmMessage.innerHTML = "<p> Please enter matching passwords. </p>";
        }
    }

    grantedUsername.innerText = "";
    newRoomiePassword.innerText = "";
    rePassword.innerText = "";
});