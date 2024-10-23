# MY FINAL PROJECT
RoomiesDuties is a web app that helps roommates keep track of all the items in their home, whether they’re shared or personal. It makes it easy to see what you’ve bought, avoid unnecessary purchases, and budget better for both shared and personal items. This helps cut down on food waste and saves money by organizing what everyone needs.

- What does it do? 
**Admins-only (homeowners)** can grant new usernames for incoming roommates, allowing them to create accounts and access the home’s product database.
Only granted usernames saved in the database can create profiles and log in.
**Roommates** can specify product details and decide whether to allow others to use the item or keep it personal.
The app includes a dashboard with a table that tracks:
  - **Product code** (auto-generated, unique for labeling)
  - **Name**
  - **Owner**
  - **Price**
  - **Type** (fruits, vegetables, ... etc)
  - **Quantity and unit**
  - **Access** (whether it’s shared or personal)
**Any roommate** can add, edit, or delete items from the shared product list.
**Admins** can view the list of usernames stored in the database to grant unique usernames for new roommates.
**Search capabilities** let you filter products by type or by which roommate owns them, making it easier to manage.


- What is the "new feature" which you have implemented that  we haven't seen before? 
**admin-grant-Login** Users can log in only if the homeowner gives them a username in person. It’s like a secret username that only the admin and the roommate know. Shhhhhhhhhh! 🤫 

## Prerequisites
You'll need to install flask and flask CORS for this project to work.


## How to run the app
To run the server: (git bash) 

```bash
FLASK_APP=app.py flask run
```



## Project Checklist
- [yes] It is available on GitHub.
- [yes] It uses the Flask web framework.
- [yes] It uses at least one module from the Python Standard 
Library other than the random module.
 Please provide the name of the module you are using in your 
app.
 - Module name: hashlib , json
- [] It contains at least one class written by you that has 
both properties and methods. It uses `__init__()` to let the 
class initialize the object's attributes (note that 
`__init__()` doesn't count as a method). This includes 
instantiating the class and using the methods in your app. 
Please provide below the file name and the line number(s) of 
at least one example of a class definition in your code as 
well as the names of two properties and two methods.
 - File name for the class definition:
 - Line number(s) for the class definition:
 - Name of two properties:
 - Name of two methods:
 - File name and line numbers where the methods are used:
- [] It makes use of JavaScript in the front end and uses the 
localStorage of the web browser.
- [] It uses modern JavaScript (for example, let and const 
rather than var).
- [] It makes use of the reading and writing to the same file 
feature.
- [] It contains conditional statements. Please provide below 
the file name and the line number(s) of at leastone example of a conditional statement in your code.
 - File name:
 - Line number(s):
- [] It contains loops. Please provide below the file name 
and the line number(s) of at least one example of a loop in your code.
 - File name:
 - Line number(s):
- [] It lets the user enter a value in a text box at some 
point.
 This value is received and processed by your back end 
Python code.
- [] It doesn't generate any error message even if the user 
enters a wrong input.
- [] It is styled using your own CSS.
- [] The code follows the code and style conventions as 
introduced in the course, is fully documented using comments 
and doesn't contain unused or experimental code. 
 In particular, the code should not use `print()` or 
`console.log()` for any information the app user should see. 
Instead, all user feedback needs to be visible in the 
browser. 
- [yes] All exercises have been completed as per the 
requirements and pushed to the respective GitHub repository.

