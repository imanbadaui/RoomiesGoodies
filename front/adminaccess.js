//admin grants new username to users, assign if new user is admin or not.
let newUsername = document.getElementById("newUsername");
let isAdminCheckBox = document.getElementById("isAdminCheckBox");
let grantButton = document.getElementById("grantButton");
let newUserConfirmMessage = document.getElementById("newUserConfirmMessage");
let goToProfileButton = document.getElementById("goToProfileButton");

let xhrNewUserAuth = new XMLHttpRequest();
let isChecked = false;


//to check whether the new user should be admin or not.
isAdminCheckBox.addEventListener("change", function () {
    isChecked = isAdminCheckBox.checked;
});

//send granted username and is admin or not data to backend to store in DB.
function sendNewUserData() {
    const newUsernameStr = newUsername.value;
    const newUserAdminAccess = isChecked;
    xhrNewUserAuth.open("POST", "http://127.0.0.1:5000/newUserGrant", true);
    xhrNewUserAuth.setRequestHeader("Content-Type", "application/json");
    // Send the user authentication data as JSON
    xhrNewUserAuth.send(JSON.stringify({ newUsername: newUsernameStr, isNewUserAdmin: newUserAdminAccess }));
    
}

grantButton.addEventListener("click", function () {
    sendNewUserData();
    xhrNewUserAuth.onload = function () {
        if (xhrNewUserAuth.status === 200)  {
            let response = JSON.parse(xhrNewUserAuth.responseText);
            if(response.message === "1"){
                newUserConfirmMessage.innerHTML = "<p> Wooop Wooop! Data sent Successfully. Congrats on having a new roommate! </p>"
            }
            else if(response.message === "0"){
                newUserConfirmMessage.innerHTML = "<p> Please Enter a username </p>"
            }
        } else {
            newUserConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
        }
    }
});

goToProfileButton.addEventListener("click" , function(){
    window.location.href = "profile.html";
});
