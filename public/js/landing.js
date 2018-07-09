$(document).ready(function() {

    var signUpForm = $("form.signup");
    var firstNameInput = $("input#firstName-input");
    var lastNameInput = $("input#lastName-input");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    
    var loginForm = $("form.login");
    var emailLogin = $("input#email-login");
    var passwordLogin = $("input#password-login");

    //sign up
        signUpForm.on("submit", function(event) {
            event.preventDefault();

            var userData = {
                firstName: firstNameInput.val().trim(),
                lastName: lastNameInput.val().trim(),
                email: emailInput.val().trim(),
                password: passwordInput.val().trim()
            };

            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                return;
            }

            signUpUser(userData.firstName, userData.lastName, userData.email, userData.password);

            firstNameInput.val("");
            lastNameInput.val("");
            emailInput.val("");
            passwordInput.val("");
        });

        function signUpUser(firstName, lastName, email, password) {
            $.post("/api/signup", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }).then(function(data) {
                window.location.replace(data);
            }).catch(handleLoginErr);
        }

        function handleLoginErr(err) {
            $("#alert .msg").text(err.responseJSON);
            $("#alert").fadeIn(500);
        }
    //sign up

    //login 
        loginForm.on("submit", function(event) {
            event.preventDefault();
            var userData = {
                email: emailLogin.val().trim(),
                password: passwordLogin.val().trim()
            };
        
            if (!userData.email || !userData.password) {
                return;
            }

            loginUser(userData.email, userData.password);
            emailLogin.val("");
            passwordLogin.val("");
        });

        function loginUser(email, password) {
            $.post("/api/login", {
                email: email,
                password: password
            }).then(function(data) {
                window.location.replace(data);
            }).catch(function(err) {
                console.log(err);
            });
        }
    //login
});
