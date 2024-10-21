//admin grants new username to users, assign if new user is admin or not.
let newUsername = document.getElementById("newUsername");
let isAdminCheckBox = document.getElementById("isAdminCheckBox");
let grantButton = document.getElementById("grantButton");
let newUserConfirmMessage = document.getElementById("newUserConfirmMessage");
let goToDashboardButton = document.getElementById("goToDashboardButton");
let allusers_button = document.getElementById("allusers_button");
let xhrNewUserAuth = new XMLHttpRequest();
let isChecked = false;
let allUsernamesList = document.getElementById("allUsernamesList");


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
        if (xhrNewUserAuth.status === 200) {
            let response = JSON.parse(xhrNewUserAuth.responseText);
            if (response.message === "1") {
                newUserConfirmMessage.innerHTML = "<p> Wooop Wooop! Data sent Successfully. Congrats on having a new roommate! </p>"
            }
            else if (response.message === "0") {
                newUserConfirmMessage.innerHTML = "<p> User already exists. </p>"
            }
        } else {
            newUserConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
        }
    }
});

goToDashboardButton.addEventListener("click", function () {
    window.location.href = "products.html";
});

let modal = document.getElementById("infoModal");
let closeBtn = document.querySelector(".close");

// Show the modal when the button is clicked
allusers_button.addEventListener("click", function() {
  modal.style.display = "block";
});

// Close the modal when the "x" is clicked
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
