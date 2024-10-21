const grantedUsername = document.getElementById("grantedUsername");
const changePasswordButton = document.getElementById("changePasswordButton");

let username = localStorage.getItem("username");
if(username){
    console.log(username);
}else{
    console.log("empty");
}

grantedUsername.innerText = username;

changePasswordButton.addEventListener("click", function(){
    window.location.href = "newpassword.html";
});