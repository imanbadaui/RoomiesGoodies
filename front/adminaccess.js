//admin grants new username to users, assign if new user is admin or not.
const newUsername = document.getElementById("newUsername");
const isAdminCheckBox = document.getElementById("isAdminCheckBox");
const grantButton = document.getElementById("grantButton");
const newUserConfirmMessage = document.getElementById("newUserConfirmMessage");
const goToDashboardButton = document.getElementById("goToDashboardButton");
const allusers_button = document.getElementById("allusers_button");
const allUsernamesList = document.getElementById("allUsernamesList");
const deleteUserButton = document.getElementById("deleteUserButton");
const deletedUserInput = document.getElementById("deletedUserInput");
const finalDeleteButton = document.getElementById("finalDeleteButton");
const deleteUserErrorMessage = document.getElementById("deleteUserErrorMessage");


let isChecked = false;
//to check whether the new user should be admin or not.
isAdminCheckBox.addEventListener("change", function () {
    isChecked = isAdminCheckBox.checked;
});

let xhrNewUserAuth = new XMLHttpRequest();
//send granted username and is admin or not data to backend to store in DB.
function sendNewUserData() {
    const newUsernameStr = newUsername.value;
    const newUserAdminAccess = isChecked;
    xhrNewUserAuth.open("POST", "http://127.0.0.1:5000/newUserGrant", true);
    xhrNewUserAuth.setRequestHeader("Content-Type", "application/json");
    // Send the user authentication data as JSON
    xhrNewUserAuth.send(JSON.stringify({ newUsername: newUsernameStr, isNewUserAdmin: newUserAdminAccess }));
    console.log(isChecked);
}

grantButton.addEventListener("click", function () {
    if (newUsername.value == "") {
        newUserConfirmMessage.innerHTML = "<p>Please enter a username. </p>"
    } else {
        sendNewUserData();
        xhrNewUserAuth.onload = function () {
            if (xhrNewUserAuth.status === 200) {
                let response = JSON.parse(xhrNewUserAuth.responseText);
                if (response.message === "1") {
                    event.preventDefault();
                    newUserConfirmMessage.innerHTML = "<p> Wooop Wooop! Data sent Successfully. Congrats on having a new roommate! </p>"
                }
                else if (response.message === "0") {
                    newUserConfirmMessage.innerHTML = "<p> User already exists. </p>"
                }
            } else {
                newUserConfirmMessage.innerHTML = "<p> An error occurred while storing new username. Please try again. </p>";
            }
        }
    }

});

goToDashboardButton.addEventListener("click", function () {
    window.location.href = "products.html";
});

let xhrAllUsernames = new XMLHttpRequest();
//sends request to receive all usernames.
function requestAllUsernames() {
    xhrAllUsernames.open("POST", "http://127.0.0.1:5000/allUsernamesRequest", true);
    xhrAllUsernames.setRequestHeader("Content-Type", "application/json");
    xhrAllUsernames.send();

}

let modal = document.getElementById("infoModal");
let modalTitle = document.getElementById("modalTitle");
let modalBody = document.getElementById("modalBody");
let closeButton = document.querySelector(".close");

// show all the usernames in the database including the admins.
allusers_button.addEventListener("click", function () {
    modal.style.display = "block";
    modalTitle.textContent = "All your Roomies Usernames";
    requestAllUsernames();
    xhrAllUsernames.onload = function () {
        if (xhrAllUsernames.status === 200) {
            let response = JSON.parse(xhrAllUsernames.response);
            let allUsernamesList = response;
            let newUsernamesStr = allUsernamesList.join(", ");
            modalBody.textContent = newUsernamesStr;

        }
    }

});

// Closes the modal when the "x" is clicked
closeButton.addEventListener("click", function () {
    modal.style.display = "none";
    deletedUserInput.style.display = "none";
    finalDeleteButton.style.display = "none";
    deleteUserErrorMessage.style.display = "none";
    deleteUserButton.style.display = "block";
});

// Closes the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        deletedUserInput.style.display = "none";
        finalDeleteButton.style.display = "none";
        deleteUserButton.style.display = "block";
        deleteUserErrorMessage.style.display = "none";
    }
});



let xhrDelete = new XMLHttpRequest();
let deletedUser = "";
//send deleted user's username to backend to delete user's data.
function sendDeleteuserRequest() {
    let deletedUser = deletedUserInput.value;
    xhrDelete.open("POST", "http://127.0.0.1:5000/deleteUser", true);
    xhrDelete.setRequestHeader("Content-Type", "application/json");
    xhrDelete.send(JSON.stringify({ deletedUsername: deletedUser }));
}

deleteUserButton.addEventListener("click", function () {
    deleteUserButton.style.display = "none";
    deletedUserInput.style.display = "block";
    finalDeleteButton.style.display = "block";
});

finalDeleteButton.addEventListener("click", function () {
    deleteUserErrorMessage.style.display = "block";

    if (deletedUserInput.value == "") {
        deleteUserErrorMessage.innerHTML = "<p> Please enter a username. </p>";
    } else {
       
        sendDeleteuserRequest();
        xhrDelete.onload = function () {
            if (xhrDelete.status === 200) {
                let response = JSON.parse(xhrDelete.responseText);
                if (response.message == "1") {
                    deleteUserErrorMessage.innerHTML = "<p>" + deletedUserInput.value + " deleted successfully. </p>";
                } else if (response.message == "0") {
                    deleteUserErrorMessage.innerHTML = "User doesn't exist.";
                }
            } else {
                deleteUserErrorMessage.innerHTML = "<p> An error occurred while deleting username. Please try again. </p>";
            }
        }
    }


});