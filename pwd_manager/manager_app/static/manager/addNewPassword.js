document.addEventListener('DOMContentLoaded', function(){ 
    const csrftoken = getCookie('csrftoken')

    const addPassButton = document.querySelector("#addPassButton");
    const siteInput = document.querySelector('input[name="site"]');
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const passphraseInput = document.querySelector('input[name="passphrase"]');

    const swalWithBtstrpBtns = Swal.mixin({
        backdrop: false,
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })

    document.querySelector("#addNewButton").onclick = () => {
        document.querySelector("#newPassForm").style.display = "block";

        addPassButton.disabled = true;
        siteInput.value = '';
        usernameInput.value = '';
        passwordInput.value = '';
        passphraseInput.value = '';

        // Prevent "New Password" form from being submitted if any of the fields is blank
        document.querySelector("#newPassForm").onkeyup = () => {
            if (siteInput.value && usernameInput.value && passwordInput.value && passphraseInput.value) {
                addPassButton.disabled = false;
            } else {
                addPassButton.disabled = true;
            }
        }
    }

    
    document.querySelector("#addPassButton").onclick = () => {
        const site = siteInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;
        const passphrase = passphraseInput.value;

        fetch('../addpass', {
            method: 'POST',
            body: JSON.stringify({
                site: site,
                username: username,
                password: password,
                passphrase: passphrase
            }),
            headers: { 'X-CSRFToken': csrftoken}
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                swalWithBtstrpBtns.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                    showClass: {
                        backdrop: 'swal2-noanimation',
                        popup: '',

                    },
                    hideClass: {
                        popup: ''
                    }
                })
                //swal("", data.error, "error")
                .then(() => {
                    passphraseInput.value = '';
                    addPassButton.disabled = true;
                    })
            } else {
                swalWithBtstrpBtns.fire({
                    icon: 'success',
                    text: data.message,
                    showClass: {
                        backdrop: 'swal2-noanimation',
                        popup: '',

                    },
                    hideClass: {
                        popup: ''
                    }
                })
                .then(() => {location.href = ''})
            }
        })

    }

    document.querySelector("#cancelAdd").onclick = () => {
        document.querySelector("#newPassForm").style.display = "none";
    }

    window.onclick = (action) => {
        if (action.target == document.querySelector("#newPassForm")){
            document.querySelector("#newPassForm").style.display = "none";
        }
    }

})


// The following function is taken from 
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}