const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const createButton = document.getElementById("createButton");
const newAccountConfirmMessage = document.getElementById("newAccountConfirmMessage");
const rePassword = document.getElementById("rePassword");
const loader = document.getElementById("loader");
const secretQuestionInput = document.getElementById("secretQuestionInput");
const magicWordLabel = document.getElementById("magicWordLabel");

let xhrNewAccountAuth = new XMLHttpRequest();

let grantedUsernameStr = ""
let newPasswordForRommie = "";
let repasswordValue = "";

//send password to the granted username to the DB
function sendNewAccountData() {
    //password for new user account
    grantedUsernameStr = grantedUsername.value;
    newPasswordForRommie = newRoomiePassword.value;
    secretWord =secretQuestionInput.value;

    xhrNewAccountAuth.open("POST", "http://127.0.0.1:5000/newAccount", true);
    xhrNewAccountAuth.setRequestHeader("Content-Type", "application/json");
    // Send the new password and granted username data as JSON
    xhrNewAccountAuth.send(JSON.stringify({ grantedUsername: grantedUsernameStr, newPassword: newPasswordForRommie, secretWord: secretWord }));
}

createButton.addEventListener("click", function () {
    newPasswordForRommie = newRoomiePassword.value;
    repasswordValue = rePassword.value;

    if (grantedUsername.value == "") {
        newAccountConfirmMessage.innerHTML = "<p> Please enter your username. </p>";
    } else if (newPasswordForRommie == "") {
        newAccountConfirmMessage.innerHTML = "<p> Please enter your new password. </p>";
    }
    else if (repasswordValue == "") {
        newAccountConfirmMessage.innerHTML = "<p> Please re-enter your password. </p>";
    }else if(secretQuestionInput.value == ""){
        newAccountConfirmMessage.innerHTML = "<p> Please enter your magic word </p>";
    }
    else {
        //if reenter password value matches the value of the new password.
        if (newPasswordForRommie == repasswordValue) {
            sendNewAccountData();
            xhrNewAccountAuth.onload = function () {
                if (xhrNewAccountAuth.status === 200) {
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
                    else if (response.message === "2") {
                        newAccountConfirmMessage.innerHTML = "<p> Account already created. </p>";
                    } else if (response.message === "-1") {
                        newAccountConfirmMessage.innerHTML = "<p> This  is not a valid username. please get back to your admin. </p>";
                    }
                } else {
                    newAccountConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
                }
            }
        } else {
            newAccountConfirmMessage.innerHTML = "<p> Please enter matching passwords. </p>";
        }
    }


    grantedUsernameStr = "";
    newPasswordForRommie = "";
    repasswordValue = "";
});


let modal = document.getElementById("infoModal");
let modalTitle = document.getElementById("modalTitle");
let modalBody = document.getElementById("modalBody");
let closeButton = document.querySelector(".close");

magicWordLabel.addEventListener("mouseover", function () {
    modal.style.display = "block";
    modalTitle.textContent = "What's that for?";
    modalBody.textContent = "This is to help you update your account later if needed. Please keep it as a secret and never share it with anyone.";

});

magicWordLabel.addEventListener("mouseout", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

