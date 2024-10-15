const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const createButton = document.getElementById("createButton");
const newAccountConfirmMessage = document.getElementById("newAccountConfirmMessage");
const goToProfileButton = document.getElementById("goToProfileButton");

let xhrNewAccountAuth = new XMLHttpRequest();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//send password to the granted username to the DB
function sendNewAccountData() {
    //password for new user account
    let grantedUsernameStr = grantedUsername.value;
    let newPasswordForRommie = newRoomiePassword.value;

    xhrNewAccountAuth.open("POST", "http://127.0.0.1:5000/newAccount", true);
    xhrNewAccountAuth.setRequestHeader("Content-Type", "application/json");
    // Send the new password and granted username data as JSON
    xhrNewAccountAuth.send(JSON.stringify({ grantedUsername: grantedUsernameStr, newPassword: newPasswordForRommie }));
}

createButton.addEventListener("click", function () {
    sendNewAccountData();
    xhrNewAccountAuth.onload = function () {
        if (xhrNewAccountAuth.status === 200) {
            //console.log(grantedUsername.value);
            let response = JSON.parse(xhrNewAccountAuth.responseText);
            if (response.message === "1") {
                newAccountConfirmMessage.innerHTML = "<p> Account created Successfully. Nice to have you home " + grantedUsername.value + "! </p>";
            } else if (response.message === "-1") { 
                newAccountConfirmMessage.innerHTML = "<p> This username doesn't exist. </p>";
            }
            else if (response.message === "0") {
                newAccountConfirmMessage.innerHTML = "<p> Please Enter a valid username and password. </p>";
            }else if(response.message === "2"){
                newAccountConfirmMessage.innerHTML = "<p> Account already created. </p>";
                window.location.href = "homepage.html";
            }
        } else {
            newAccountConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
        }
    }
});

goToProfileButton.addEventListener("click", function () {
    window.location.href = "profile.html";
});