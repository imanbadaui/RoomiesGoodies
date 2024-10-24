# MY FINAL PROJECT

**RoomiesDuties** is a web app that helps roommates keep track of all the items in their home, whether they’re shared or personal. It makes it easy to see what you’ve bought, avoid unnecessary purchases, and budget better for both shared and personal items. This helps cut down on food waste and saves money by organizing what everyone needs.

## What does it do?

- **Admin Functionality**: 
  - **Admins (homeowners)** can grant new usernames for incoming roommates, allowing them to create accounts and access the home’s product database.
  - Only granted usernames saved in the database can create profiles and log in.
  
- **Roommate Functionality**: 
  - Roommates can specify product details and decide whether to allow others to use the item or keep it personal.
  
- **Dashboard**: 
  - The app includes a dashboard with a table that tracks:
    - **Product Code**: Auto-generated, unique for labeling
    - **Name**
    - **Owner**
    - **Price**
    - **Type**: (e.g., fruits, vegetables)
    - **Quantity and Unit**
    - **Access**: Whether it’s shared or personal
  
- **Item Management**: 
  - Any roommate can add, edit, or delete items from the shared product list.
  - Admins can view the list of usernames stored in the database to grant unique usernames for new roommates.
  
- **Search Capabilities**: 
  - Filter products by type or by which roommate owns them, making it easier to manage.

## Unique Feature

**Admin-Grant Login**: Users can log in only if the homeowner gives them a username in person. It’s like a secret username that only the admin and the roommate know. Shhhhhhhhhh! 🤫 

## Features

My project separates work of front-end from work of backend and has APIs between Javascript front-end and python back-end using XHR.
Log-in Log-out
Admin-only Access.
Create new account.
hashed passwords.
Username is stored in local storage.
CRUD for user information and for product information.
Dashboard with table view for DB.
XMLHttpRequest APIs.

## Prerequisites

You'll need to install Flask and Flask-CORS for this project to work.
You'll need to run the server from the Live Server Extension in VS code.

## Project Requirements
✅ My project is available on GitHub.
✅ It uses the Flask web framework.
✅ It uses at least one module from the Python Standard Library.
✅ It has more than one class each with a constructor, fields and methods.
✅ It uses localstorage to store username when login.
✅ It uses modern JavaScript.
✅ It reads and writes to more than one .json files.
✅ It contains both conditional statements and loops.
✅ No Errors and No Wrong Input. "at least that's what we hope for!"
✅ many values received from user are sent to backend to authenticate.
✅ It is styled using CSS.
✅ Code is fully documented and self-explained.

## How to Run the App

To run the server, use Git Bash:

```bash
FLASK_APP=app.py flask run
```
Start with homepage.html page from the Live Server extension.
