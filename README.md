# Password Manager

This is a simple password manager built as a final project for CS50's Web Programming with Python and JavaScript. It probably shouldn't be used, given the security risks invovled. But if one would like to, below is how to get it working.

## Set-up

Create a virtual environment and activate it: 

    python3 -m venv env
    source env/bin/activate

(env) should now be visible before your command prompt. Use the command `deactivate` to exit the virtual environment at any time. 

Install requirements:

    pip install -U pip
    pip install -r requirements.txt
 
## Usage

Once the virtual environment is active, enter the following at the command line to run the application locally.
    
    python3 manage.py runserver


## Features

The application has the features one might expect of a standard password manager: the ability to store passwords, view them, copy them to the clipboard, and delete them. Passwords are hidden by default and can be un-hidden if you'd like to see them. You don't need to un-hide a password to copy it to the clipboard.

During account-creation, you'll be asked to choose a passphrase. The passphrase is necessary for encrypting and decrypting passwords. There's no way to recover a passphrase, so if it's lost, all stored passwords are inaccessible. 

