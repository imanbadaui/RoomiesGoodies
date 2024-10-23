const grantedUsername = document.getElementById("grantedUsername");
const changePasswordButton = document.getElementById("changePasswordButton");

let username = localStorage.getItem("username");

grantedUsername.value = "Your granted username is: " + username;

changePasswordButton.addEventListener("click", function(){
    window.location.href = "newpassword.html";
});