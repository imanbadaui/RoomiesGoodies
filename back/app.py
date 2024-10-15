import flask
from flask_cors import CORS
import hashlib
from user import User
from data_handler_api import read_json_db , write_json_db

app = flask.Flask("RoomiesGoodies") #creates web App
CORS(app)

#hashing function: must be same as used in user.py
def hash_pass(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Specify the path to the JSON file
users_db = 'user_auth_db.json'
products_db = 'products_db.json'

#change from static to dynamic. front end must send first admin details.
#create first admin
def create_first_admin():
	first_admin_name = "Immz"
	first_admin_pass = "3e37844873"
	is_admin = True
	first_user = User(first_admin_name, first_admin_pass, is_admin)
	#serializing object user to be stored in json
	first_user_dict = first_user.to_dict()
	write_json_db(users_db, first_user_dict)

#create first admin only if not exist
data = read_json_db(users_db)
if not data:
	create_first_admin()

#receive user login data from front end
@app.route("/login" , methods=['POST'])
def receive_login_data():
	user_is_admin = False

	# Get the JSON login ata sent from the client
	data = flask.request.get_json()  
	username = data.get("username")
	password = data.get("password")

	#hash received password to compare with stored hashed password
	hashed_pass = hash_pass(password)

	#reading users from JSON
	allusers_data = read_json_db(users_db)
	message = "-1"  #user not found
	
	for user in allusers_data:
		if user['username'] == username: # Check if the username exist in DB
			if user['password'] == hashed_pass:  # Check if the hashed passwords matches a record in DB
				message = "1"  #Login successful
				if user['is_admin']:
					user_is_admin = True
				break
			else:
				message = "0"  # Wrong password
				break
	return flask.jsonify({'message': message , 'user_is_Admin' : user_is_admin})  # Respond with a message


#receive granted user data from front end
@app.route("/newUserGrant" , methods=['POST'])
def receive_newuser_grant_data():
	# Get the JSON newuser grant sent from the frontend
	data = flask.request.get_json()  
	new_username = data.get("newUsername")
	is_new_user_admin = data.get("isNewUserAdmin")
	if new_username != "":
		new_user = User(new_username, "", is_new_user_admin)
		new_user_dict = new_user.to_dict()
		write_json_db(users_db, new_user_dict)
		#1 means created successfully
		return flask.jsonify({'message': "1"})
	else:
		#0 means there was no username sent and no object created in DB
		return flask.jsonify({'message': "0"})



#receive password of granted user data from front end
@app.route("/newAccount" , methods=['POST'])
def receive_newuser_password_data():
	# Get the JSON newuser username and password sent from the frontend
	data = flask.request.get_json()  

	granted_username = data.get("grantedUsername")
	new_password = data.get("newPassword")

	if granted_username != "" and new_password != "":
		hashed_pass = hash_pass(new_password)
		#read users from JSON
		allusers_data = read_json_db("user_auth_db.json")

		added = False
		for user in allusers_data:
			if user['granted_username'] == granted_username: # Check if the username exist in DB
				user['new_password'] = hashed_pass
				#1 means created successfully
				return flask.jsonify({'message': "1"})
			else:
				#0 means user not exist
				return flask.jsonify({'message': "0"})
