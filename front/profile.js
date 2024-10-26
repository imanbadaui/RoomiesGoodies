const grantedUsername = document.getElementById("grantedUsername");
const changePasswordButton = document.getElementById("changePasswordButton");
const mainContainer = document.getElementById("mainContainer");

//don't reload unless login or admin button is pressed.
//mainContainer is hidden unless user logs in.
window.onload = function () {
    const loggedIn = localStorage.getItem("isUserLoggedIn");

    if (loggedIn != "true") {
        window.location.href = "homepage.html";
    }else{
        mainContainer.style.display = "block";
    }
};

let username = localStorage.getItem("username");
        
grantedUsername.value = "Your granted username is: " + username;

changePasswordButton.addEventListener("click", function(){
    window.location.href = "newpassword.html";
});

