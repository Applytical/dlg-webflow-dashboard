<script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-auth.js"></script>
<script>
  var webflowAuth = {
    loginPath: '/',
    loginRedirectPath: '/account/subscriptions',
    signupPath: '/signup',
    signupRedirectPath: '/account/subscriptions',
    logoutRedirectPath: '/logout',
    firebaseConfig: {
      apiKey: "AIzaSyBgFjbyL0sLVaMFz5uYYy3LXWe53I9TLak",
      authDomain: "dlg-dashboard-app.firebaseapp.com",
      projectId: "dlg-dashboard-app",
      storageBucket: "dlg-dashboard-app.appspot.com",
      appId: "256283946678",
    }
  };

  firebase.initializeApp(webflowAuth.firebaseConfig);

  firebase.analytics && firebase.analytics();

  {
    var user;
    var bodyAuth = document.body.getAttribute('data-user-auth');
    var bodyUnauth = document.body.getAttribute('data-user-unauth');
    var userAuth = document.querySelectorAll('[data-user-auth]');
    var userUnauth = document.querySelectorAll('[data-user-unauth]');
    var userDisplayName = document.querySelectorAll('[data-user-displayName]');
    var userEmail = document.querySelectorAll('[data-user-email]');
    var userContent = document.querySelectorAll('[data-user]');

    userAuth.forEach(function (el) { el.style.display = 'none'; });
    userUnauth.forEach(function (el) { el.style.display = 'none'; });

    function updateContent() {
      if (!user) {
        return;
      }
      userContent.forEach(function (el) {
        el.innerText = el.innerText.replace(/\{\{([^\}]+)\}\}/g, function (match, variable) {
          return typeof user[variable] === 'undefined' ? '' : user[variable];
        });
      });
    }

    firebase.auth().onAuthStateChanged(function (authUser) {
      user = authUser;

      updateContent();

      if (user && bodyUnauth) {
        window.location.href = webflowAuth.loginRedirectPath;
      } else if (!user && bodyAuth) {
        window.location.href = webflowAuth.loginPath;
      }
      if (user) {
        userAuth.forEach(function (el) { el.style.display = null; });
        userUnauth.forEach(function (el) { el.style.display = 'none'; });

        userEmail.forEach(function (el) { el.innerText = user.email; });
        userDisplayName.forEach(function (el) { el.innerText = user.email; });

        const customerEmail = sessionStorage.setItem("email", user.email);

        const customerName = sessionStorage.getItem("Name");
        if (!customerName) {
          getCustomer();
        }

        function getCustomer() {
          axios.post("https://dlg-dashboard-middleware-dq3sp5a3uq-uw.a.run.app/webflow/customer", {
            email: user.email
          })
            .then((response) => {
              if (response.status == 200) {
                sessionStorage.setItem("Name", response.data.firstName + " " + response.data.lastName);
                sessionStorage.setItem("customerId", response.data.customerId);
                user.updateProfile({
                  displayName: response.data.firstName + " " + response.data.lastName,
                }).then(() => {
                  // Update successful
                  // ...
                }).catch((error) => {
                  // An error occurred
                  // ...
                  console.log(error);
                })
              }
            })
            .catch((error) => {
            });;
        }
        function nameToInitials(fullName) {
          const namesArray = fullName.trim().split(' ');
          if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
          else return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`;
        }
        let intitals

        if (user.displayName) {
          intitals = nameToInitials(user.displayName);
        } else {
          intitals = nameToInitials(user.email);
        }

        const avatar = document.getElementById('avatarImage').textContent = intitals;

        if (window.location.pathname == "/account/settings") {
          const avatarSettings = document.getElementById('avatarImageSettings').textContent = intitals;
        }

      } else {
        userAuth.forEach(function (el) { el.style.display = 'none'; });
        userUnauth.forEach(function (el) { el.style.display = null; });

        userEmail.forEach(function (el) { el.innerText = ''; });
        userDisplayName.forEach(function (el) { el.innerText = ''; });
      }
    });

    var signupForms = document.querySelectorAll('[data-signup-form]');
    var signupErrors = document.querySelectorAll('[data-signup-error]');
    var signupLoading = document.querySelectorAll('[data-signup-loading]');
    var signupIdle = document.querySelectorAll('[data-signup-idle]');

    signupForms.forEach(function (el) {
      var signupEmail = el.querySelector('[data-signup-email]');
      var signupPassword = el.querySelector('[data-signup-password]');

      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        signupErrors.forEach(function (el) { el.style.display = 'none'; });
        signupLoading.forEach(function (el) { el.style.display = 'block'; });
        signupIdle.forEach(function (el) { el.style.display = 'none'; });

        firebase.auth().createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
          .then(function (authUser) {
            user = authUser;
            window.location.href = webflowAuth.signupRedirectPath;
          })
          .catch(function (error) {
            setTimeout(function () {
              signupErrors.forEach(function (el) {
                el.innerText = error.message;
                el.style.display = 'block';
              });

              signupLoading.forEach(function (el) { el.style.display = 'none'; });
              signupIdle.forEach(function (el) { el.style.display = null; });
            }, 1000);
          });
      });
    });

    var loginForms = document.querySelectorAll('[data-login-form]');
    var loginErrors = document.querySelectorAll('[data-login-error]');
    var loginLoading = document.querySelectorAll('[data-login-loading]');
    var loginIdle = document.querySelectorAll('[data-login-idle]');

    loginForms.forEach(function (el) {
      var loginEmail = el.querySelector('[data-login-email]');
      var loginPassword = el.querySelector('[data-login-password]');

      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        loginErrors.forEach(function (el) { el.style.display = 'none'; });
        loginIdle.forEach(function (el) { el.style.display = 'none'; });
        loginLoading.forEach(function (el) { el.style.display = 'block'; });

        firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
          .then(function (authUser) {
            user = authUser;
            window.location.href = webflowAuth.loginRedirectPath;
          })
          .catch(function (error) {
            setTimeout(function () {
              loginErrors.forEach(function (el) {
                el.innerText = error.message;
                el.style.display = 'block';
              });

              loginIdle.forEach(function (el) { el.style.display = null; });
              loginLoading.forEach(function (el) { el.style.display = 'none'; });
            }, 1000);
          });
      });
    });
    var forgotPasswordForm = document.querySelectorAll('[data-forgot-form]');
    var forgotErrors = document.querySelectorAll('[data-forgot-error]');
    var forgotLoading = document.querySelectorAll('[data-forgot-loading]');
    var forgotIdle = document.querySelectorAll('[data-forgot-idle]');

    forgotPasswordForm.forEach(function (el) {
      var loginEmail = el.querySelector('[data-forgot-email]');

      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        forgotErrors.forEach(function (el) { el.style.display = 'none'; });
        forgotIdle.forEach(function (el) { el.style.display = 'none'; });
        forgotLoading.forEach(function (el) { el.style.display = 'block'; });

        firebase.auth().sendPasswordResetEmail(loginEmail.value).then(function (authUser) {
          user = authUser;
          window.location.href = webflowAuth.loginRedirectPath;
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          phoneFormErrors.forEach(function (el) {
            el.innerText = error.message;
            el.style.display = 'block';
          });
          setTimeout(function () {
            phoneFormIdle.forEach(function (el) { el.style.display = null; });
            phoneFormLoading.forEach(function (el) { el.style.display = 'none'; });
          }, 1000);
        });
      });
    });

    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://hub.livingooddaily.com/account/finish-signup',
      // This must be true.
      handleCodeInApp: true,

      dynamicLinkDomain: 'dlgapp.page.link'
    };

    var emailLink = document.querySelectorAll('[data-link-form]');
    var emailLinkErrors = document.querySelectorAll('[data-link-error]');
    var emailLinkLoading = document.querySelectorAll('[data-link-loading]');
    var emailLinkIdle = document.querySelectorAll('[data-link-idle]');

    emailLink.forEach(function (el) {
      var loginEmail = el.querySelector('[data-link-email]');

      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        emailLinkErrors.forEach(function (el) { el.style.display = 'none'; });
        emailLinkIdle.forEach(function (el) { el.style.display = 'none'; });
        emailLinkLoading.forEach(function (el) { el.style.display = 'block'; });

        firebase.auth().sendSignInLinkToEmail(loginEmail.value, actionCodeSettings).then(() => {
          window.localStorage.setItem('emailForSignIn', loginEmail.value);
        }).catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          emailLinkErrors.forEach(function (el) {
            el.innerText = error.message;
            el.style.display = 'block';
          });
          setTimeout(function () {
            emailLinkIdle.forEach(function (el) { el.style.display = null; });
            emailLinkLoading.forEach(function (el) { el.style.display = 'none'; });
          }, 1000);
        });
      });
    });



 // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result) => {
        console.log(result);
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }

    firebase.auth().useDeviceLanguage();

    var phoneLink = document.querySelectorAll('[data-phone-form]');
    var phoneFormErrors = document.querySelectorAll('[data-phone-error]');
    var phoneFormLoading = document.querySelectorAll('[data-phone-loading]');
    var phoneFormIdle = document.querySelectorAll('[data-phone-idle]');


    var phoneNumber = document.querySelector('[data-form-phone-number]');
    var requestButton = document.querySelector('[data-form-phone-request]');
    var oneTimeLogin = document.querySelector('[data-form-phone-login]');

    phoneLink.forEach(function (el) {

      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
          //reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        }
      });
      const appVerifier = window.recaptchaVerifier;


      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        phoneFormErrors.forEach(function (el) { el.style.display = 'none'; });
        phoneFormIdle.forEach(function (el) { el.style.display = 'none'; });
        phoneFormLoading.forEach(function (el) { el.style.display = 'block'; });

        var requestButton = document.querySelector('[data-form-phone-request]');

        requestButton.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          requestButton.value = "Request Sent";

          firebase.auth().signInWithPhoneNumber(phoneNumber.value, appVerifier)
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;

              setTimeout(() => {
                requestButton.value = "Send Again";
              }, 5000)

              oneTimeLogin.style.display = "block";
              // ...
            }).catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorCode);
              console.log(errorMessage);
              phoneFormErrors.forEach(function (el) {
                el.innerText = error.message;
                el.style.display = 'block';
              });
              setTimeout(function () {
                phoneFormIdle.forEach(function (el) { el.style.display = null; });
                phoneFormLoading.forEach(function (el) { el.style.display = 'none'; });
              }, 1000);
            });

        });
        var oneTimeLogin = el.querySelector('[data-form-phone-login]');
        oneTimeLogin.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var phoneNumberCode = el.querySelector('[data-form-phone-code]');
          phoneNumberCode.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i>Loading`
          confirmationResult.confirm(phoneNumberCode.value).then((authUser) => {
            // User signed in successfully.
            user = authUser;
            window.location.href = webflowAuth.loginRedirectPath;
          }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            phoneFormErrors.forEach(function (el) {
              el.innerText = error.message;
              el.style.display = 'block';
            });
            setTimeout(function () {
              phoneFormIdle.forEach(function (el) { el.style.display = null; });
              phoneFormLoading.forEach(function (el) { el.style.display = 'none'; });
            }, 1000);
          });

        });
      })
    });






    var authLogout = document.querySelectorAll('[data-logout]');

    authLogout.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.removeItem('subscriptions');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('customerId');
        sessionStorage.removeItem('Name');

        firebase.auth().signOut().then(function () {
          user = null;
          
          const logout = sessionStorage.setItem("logout", "true");
          window.location.href = webflowAuth.logoutRedirectPath;
        })
          .catch(function () { });
      });
    })
  }

</script>