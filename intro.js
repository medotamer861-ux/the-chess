function register(e){
    e.preventDefault();

    var name = document.getElementById("signupName").value;
    var email = document.getElementById("signupEmail").value;
    var pass = document.getElementById("signupPassword").value;

    if(name === "" || email === "" || pass === ""){
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", pass);


    alert("Account Created Successfully!");
}

function login(e){
    e.preventDefault();

    var email = document.getElementById("loginEmail").value;
    var pass = document.getElementById("loginPassword").value;

    var savedEmail = localStorage.getItem("email");
    var savedPass = localStorage.getItem("password");

    if(email === savedEmail && pass === savedPass){
        window.location.href = "home.html";
    } else {
        alert("Wrong Email or Password");
    }
}
document.addEventListener("DOMContentLoaded", function(){

    var name = localStorage.getItem("name");

    if(!name){
        window.location.href = "intro.html";
    } else {
        var userSpan = document.getElementById("usernameDisplay");
        if(userSpan){
            userSpan.textContent = name;
        }
    }

});

function logout(){
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    window.location.href = "intro.html";
}
