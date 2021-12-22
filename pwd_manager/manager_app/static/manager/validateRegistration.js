document.addEventListener("DOMContentLoaded", function () {

    const registerButton = document.querySelector("#registerButton");
    registerButton.disabled = true;

    const usernameInput = document.querySelector('input[name="username"]');
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const passConfirmInput = document.querySelector('input[name="confirmation"]');
    const passphraseInput = document.querySelector('input[name="passphrase"]');
    const passphraseConfirmInput = document.querySelector('input[name="passphraseconfirm"]');

    document.querySelector("#registration").onkeyup = () => {
        if (passConfirmInput.value && usernameInput.value && passwordInput.value && passphraseInput.value && passphraseConfirmInput.value && emailInput) {
            registerButton.disabled = false;
        } else {
            registerButton.disabled = true;
        }
    }

    const form = document.querySelector("#registerForm");

    form.addEventListener("submit", function(e) {
        if (passwordInput.value != passConfirmInput.value){
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Passwords do not match.",
                showClass: {
                    backdrop: 'swal2-noanimation',
                    popup: '',

                },
                hideClass: {
                    popup: ''
                }
            })
        } else if (passphraseInput.value != passphraseConfirmInput.value){
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Passphrases do not match.",
                showClass: {
                    backdrop: 'swal2-noanimation',
                    popup: '',

                },
                hideClass: {
                    popup: ''
                }
            })
        }
    })
})