document.addEventListener('DOMContentLoaded', function () {
    const csrftoken = getCookie('csrftoken');
    let passphrase = '';


    document.querySelectorAll(".edit-buttons").forEach((button) => {
        button.onclick = () => {

            const passID = button.dataset.passid;
            const buttonClasses = button.classList;

            if (!passphrase) {
                (async () => {
                    const { value: password } = await Swal.fire({
                        title: 'Please enter your master passphrase',
                        input: 'password',
                        inputPlaceholder: 'Passphrase',
                        inputAttributes: {
                            autocapitalize: 'off',
                            autocorrect: 'off'
                        },
                        showClass: {
                            backdrop: 'swal2-noanimation',
                            popup: '',

                        },
                        hideClass: {
                            popup: ''
                        }
                    })

                    if (password) {
                        passphrase = password;
                        // Validate passphrase
                        fetch('../checkphrase', {
                            method: 'POST',
                            body: JSON.stringify({
                                passphrase: passphrase
                            }),
                            headers: { 'X-CSRFToken': csrftoken }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    Swal.fire({
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
                                        .then(() => { passphrase = ''; })
                                } else {
                                    setTimeout(() => { passphrase = '' }, 30000) // Store the passphrase for a set amount of time
                                    if (buttonClasses.contains('fa-eye')) {
                                        // Show password
                                        if (buttonClasses.contains('fa-eye-slash')) {
                                            const showPassword = async () => {
                                                const pwd = await getStoredPass(passphrase, passID, csrftoken)
                                                pass_div = document.querySelector(`[id="${passID}"]`);
                                                pass_div.type = 'text';
                                                pass_div.value = pwd;
                                            };
                                            showPassword();
                                            buttonClasses.remove('fa-eye-slash');
                                        } else {
                                            pass_div = document.querySelector(`[id="${passID}"]`);
                                            pass_div.type = 'password';
                                            pass_div.value = ' '.repeat(8);
                                            buttonClasses.add('fa-eye-slash');
                                        }
                                    } else if (buttonClasses.contains('fa-copy')) {
                                        // Copy password
                                        const copyPassword = async () => {
                                            const pwd = await getStoredPass(passphrase, passID, csrftoken);
                                            navigator.clipboard.writeText(pwd)
                                        };
                                        copyPassword();
                                    } else {
                                        // Delete password
                                        Swal.fire({
                                            title: "Are you sure?",
                                            text: "This can't be undone.",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: "Yes, delete it.",
                                            showClass: {
                                                backdrop: 'swal2-noanimation',
                                                popup: '',

                                            },
                                            hideClass: {
                                                popup: ''
                                            }
                                        }).then((result => {
                                            if (result.isConfirmed) {
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: "Deleted.",
                                                    text: "Your password has been deleted.",
                                                    showClass: {
                                                        backdrop: 'swal2-noanimation',
                                                        popup: '',

                                                    },
                                                    hideClass: {
                                                        popup: ''
                                                    }
                                                })
                                                    .then(fetch('../deletepass', {
                                                        method: 'POST',
                                                        body: JSON.stringify({
                                                            id: passID
                                                        }),
                                                        headers: { 'X-CSRFToken': csrftoken }
                                                    }))
                                                    .then(() => location.href = '')
                                            }
                                        }))
                                    }
                                }
                            })
                    }
                })()
            } else {
                if (buttonClasses.contains('fa-eye')) {
                    // Show password
                    if (buttonClasses.contains('fa-eye-slash')) {
                        const showPassword = async () => {
                            const pwd = await getStoredPass(passphrase, passID, csrftoken)
                            pass_div = document.querySelector(`[id="${passID}"]`);
                            pass_div.type = 'text';
                            pass_div.value = pwd;
                        };
                        showPassword();
                        buttonClasses.remove('fa-eye-slash');
                    } else {
                        pass_div = document.querySelector(`[id="${passID}"]`);
                        pass_div.type = 'password';
                        pass_div.value = ' '.repeat(8);
                        buttonClasses.add('fa-eye-slash');
                    }
                } else if (buttonClasses.contains('fa-copy')) {
                    // Copy password
                    const copyPassword = async () => {
                        const pwd = await getStoredPass(passphrase, passID, csrftoken);
                        navigator.clipboard.writeText(pwd)
                    };
                    copyPassword();
                } else {
                    // Delete password
                    Swal.fire({
                        title: "Are you sure?",
                        text: "This can't be undone.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: "Yes, delete it.",
                        showClass: {
                            backdrop: 'swal2-noanimation',
                            popup: '',

                        },
                        hideClass: {
                            popup: ''
                        }
                    }).then((result => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                title: "Deleted.",
                                text: "Your password has been deleted.",
                                showClass: {
                                    backdrop: 'swal2-noanimation',
                                    popup: '',

                                },
                                hideClass: {
                                    popup: ''
                                }
                            })
                                .then(fetch('../deletepass', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        id: passID
                                    }),
                                    headers: { 'X-CSRFToken': csrftoken }
                                }))
                                .then(() => location.href = '')
                        }
                    }))
                }
            }

        }






    })


});


// Function for retrieving stored password
async function getStoredPass(passphrase, id, csrftoken) {
    const pwd = fetch('../getpwd', {
        method: 'POST',
        body: JSON.stringify({
            passphrase: passphrase,
            id: id
        }),
        headers: { 'X-CSRFToken': csrftoken }
    })
        .then(response => response.json())
        .then(data => data.password)

    return pwd
}


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