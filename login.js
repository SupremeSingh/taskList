//  Instantiate Firebase Object
let auth_obj = firebase.auth();

// Login-related Links
let username = document.getElementById("login_username");
let password = document.getElementById("login_password");
let login_button = document.getElementById("login_button");
let reg_button = document.getElementById("signin_button");

// Event Listeners
login_button.addEventListener('click', (e) => {
  e.preventDefault();

  let login_promise = auth_obj.signInWithEmailAndPassword(username.value, password.value);
  login_promise.catch(e => alert("Incorrect Login Details"));
});

reg_button.addEventListener('click', (e) => {
    e.preventDefault();

    let register_promise = auth_obj.createUserWithEmailAndPassword(username.value, password.value);
    register_promise.catch(e => alert("Incorrect Sign In Details"));
});

// Change Page after Login
auth_obj.onAuthStateChanged((user) => {
    if (user) {
        window.location.replace("index.html");
    } 
});
