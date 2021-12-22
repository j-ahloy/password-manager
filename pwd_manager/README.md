# Password Management

## Description
The capstone project is a basic password management application. Users can easily add and retrieve passwords, toggle a password's visibility on screen, copy a password to the clipboard, and delete passwords that no longer need to be managed. The application is implemented using Django for the back-end and JavaScript for the front-end. Webpages were designed using Bootstrap and should be mobile-responsive. 

## Distinctiveness and Complexity
Though the application uses concepts employed in the course's projects, it is not intended to serve a purpose similar to any of the apps from those projects. And while the application should not actually be used to manage passwords because of the security risks involved, some thought and research went into how one might begin to securely store passwords. 

When an account is created for the app, the user is required to specify a passphrase (auxiliary to the account's password) that will be used to manage the storage of passwords. On the back-end, a "master" encryption key is generated for a user when their account is created. 

This master key is used to encrypt a password for storage in a database, or decrypt a password upon retrieval from storage, but is not stored in its raw form or provided to the user. Rather, this master key is encrypted using a key derived from a user's passphrase before being stored in a database. As such, a user's passphrase is required to store a new external password, or retrieve an already-stored password, since the master key must first be retrieved and decrypted with the passphrase-derived key before it can be used. This method of handling passwords unfortunately means that the loss of a passphrase renders an account unusable, but storage is more secure because the master key and passwords cannot be obtained by simply accessing the databases. 

## Files

The following files are of primary importance:
- requirements.txt
- views.py
- models.py
- validateRegistration.js
- addNewPassword.js
- savedPasswordInteraction.js

*requirements.txt* specifies the Python packages that are needed to run the application. 

*views.py* contains the Python code that handles registration and logging in of users, the display of stored passwords to users, the addition of passwords to a database, the retrieval of passwords from a database, and the deletion of stored passwords. 

*models.py* contains the definitions of three models: one for users, one for users' master keys, and one for stores passwords.

*validateRegistration.js* contains some JavaScript code that prevents a user from registering for an account if their password or passphrase input and confirmation don't match, or if all of the registration form hasn't been completed. 

*addNewPassword.js* contains JavaScript code that handles the submission of a form to add a new password. 

*savedPasswordInteraction.js* contains JavaScript code that allows a user to interact with a saved password by either toggling its visibility on screen, copying it to the clipboard, or deleting it. 

## Running the application

All files necessary for running the application are included. The application is not currently deployed anywhere, but the files can be downloaded for local use in Django's web server. 