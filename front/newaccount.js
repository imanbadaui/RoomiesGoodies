const grantedUsername = document.getElementById("grantedUsername");
const newRoomiePassword = document.getElementById("newRoomiePassword");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const createButton = document.getElementById("createButton");


let xhrNewAccountAuth = new XMLHttpRequest();

//send password to the granted username to the DB
function sendNewUserData() {
    const newUsernameStr = newRoomiePassword.value;
    xhrNewUserAuth.open("POST", "http://127.0.0.1:5000/newAccount", true);
    xhrNewUserAuth.setRequestHeader("Content-Type", "application/json");
    // Send the user authentication data as JSON
    xhrNewUserAuth.send(JSON.stringify({ newUsername: newUsernameStr }));
    
}

createButton.addEventListener("click", function(){


});