import flask
import json
from flask_cors import CORS
import hashlib
from user import User
from product import Product
from data_api import read_json_db , write_json_db

app = flask.Flask("RoomiesGoodies") #creates web App
CORS(app)

#hashing function: must be same as used in user.py
def hash_pass(password):
    return hashlib.sha256(password.encode()).hexdigest()


# Specify the path to the JSON file
users_db = 'user_auth_db.json'
products_db = 'products_db.json'


#Future change: convert from hardcoding to dynamic. front end must send first admin details.
#create first admin
#Note: in users_db, All passwords other than "Immz" is = 123
def create_first_admin():
	first_admin_name = "Immz"
	first_admin_pass = "3e37844873"
	is_admin = True
	secret_word = "tometotomato"
	first_user = User(first_admin_name, first_admin_pass, is_admin, secret_word)
	#serializing object user to be stored in json
	first_user_dict = first_user.to_dict()
	write_json_db(users_db, first_user_dict)

#create first admin only if not exist in DB.
data = read_json_db(users_db)
if not data:
	create_first_admin()




##### Login API #####
#CRUD READ
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





##### Admin API #####
#CRUD CREATE.
#receives granted user data from front end
@app.route("/newUserGrant" , methods=['POST'])
def receive_newuser_grant_data():
	# Get the JSON newuser grant sent from the frontend
	data = flask.request.get_json()  
	new_username = data.get("newUsername")
	is_new_user_admin = data.get("isNewUserAdmin")
	user_exist = False
	if new_username != "":
		allusers_data = read_json_db(users_db)
		for user in allusers_data:
			if user['username'] == new_username:
				user_exist = True
				break
		if not user_exist:
			new_user = User(new_username, "", is_new_user_admin, "")
			new_user_dict = new_user.to_dict()
			write_json_db(users_db, new_user_dict)
			#1 means created successfully
			return flask.jsonify({'message': "1"})
		else:
		#0 means user already exists
			return flask.jsonify({'message': "0"})
	else:
		#-1 means username sent from front end is empty string
			return flask.jsonify({'message': "-1"})





##### New Account API #####
#CRUD UPDATE
#receive password of granted user data from front end
@app.route("/newAccount" , methods=['POST'])
def receive_newAccount_password_data():
	#Get the JSON password and granted username sent from the frontend
	data = flask.request.get_json()  
	granted_username = data.get("grantedUsername")
	new_password = data.get("newPassword")
	secret_word = data.get("secretWord")

	user_exists = False
	data_updated = False

	if granted_username != "" and new_password != "" and secret_word != "":
		#read users from JSON
		allusers_data = read_json_db(users_db)
		hashed_pass = hash_pass(new_password)
		for user in allusers_data:
			if user['username'] == granted_username:
				user_exists = True
				#if user with password already exist
				if user['password'] != "" and user['secret_word'] != "":
					data_updated = False
					break
				else:
					user['password'] = hashed_pass
					user['secret_word'] = secret_word
					#convert JSON list of objects to string
					ALL_data_str = json.dumps(allusers_data)
					delete_record_helper(users_db, ALL_data_str)
					data_updated = True

		if user_exists:
			if data_updated:
				#1 implies data stored successfully  
				return flask.jsonify({'message': "1"})	
			else:
				#2 implies user already exists
				return flask.jsonify({'message': "2"})

		else:
			#-1 implies user doesn't exist 
			return flask.jsonify({'message': "-1"})	 			   	
	else:
		#0 means an empty data is sent
		return flask.jsonify({'message': "0"})


#CRUD DELETE
def delete_record_helper(file_path, data_str):
	file = open(file_path, 'w')
	file.truncate(0)
	file.write(data_str)






##### Forgot Password API #####
#CRUD UPDATE.
#receives granted user and new password.
@app.route("/newPassword" , methods=['POST'])
def receive_new_password_data():
	#Get the JSON password and granted username sent from the frontend
	data = flask.request.get_json()  
	granted_username = data.get("grantedUsername")
	new_password = data.get("newPassword")
	secret_word = data.get("secretWord")
	user_exists = False
	secret_word_exists = False
	data_updated = False
	if granted_username != "" and new_password != "" and secret_word != "":
		#read users from JSON
		allusers_data = read_json_db(users_db)
		hashed_pass = hash_pass(new_password)
		
		for user in allusers_data:
			#if user with password already exist
			if user['username'] == granted_username:
				user_exists = True
				if  user['secret_word'] == secret_word:
					secret_word_exists = True
					if user['password'] != "":
						#remove old password
						user['password'] = ""
						#add new password
						user['password'] = hashed_pass
						#convert JSON list of objects to string
						ALL_data_str = json.dumps(allusers_data)
						delete_record_helper(users_db, ALL_data_str)
						data_updated = True
						break

		if not user_exists:
			#-1 implies user doesn't have an account yet to use forgot password 
			return flask.jsonify({'message': "-1"})
		
		elif not secret_word_exists:
				#-2 implies secret word doesn't match          
				return flask.jsonify({'message': "-2"})

		if data_updated:
			#1 implies data stored successfully            
			return flask.jsonify({'message': "1"})
			
	else:
		#0 means an empty data is sent
		return flask.jsonify({'message': "0"})
	






##### Deleting a user API #####
#CRUD DELETE.
@app.route("/deleteUser" , methods=['POST'])
def receive_deleted_user():
	data = flask.request.get_json()  
	deleted_username = data.get("deletedUsername")
	old_users_list = read_json_db(users_db)
	new_users_list = []

	for user in old_users_list:
		if user['username'] != deleted_username:
			new_users_list.append(user)

	if len(new_users_list) < len(old_users_list):
		ALL_data_str = json.dumps(new_users_list)
		delete_record_helper(users_db, ALL_data_str)
		#1 means user deleted successfully.
		return flask.jsonify({'message': "1"})
	else:
		#0 means user not exist.
		return flask.jsonify({'message': "0"})
	
	
	
	
	
##### All Usernames API #####
#CRUD READ.
#returns a list of all the usernames in DB to the front-end.
@app.route("/allUsernamesRequest" , methods=['POST'])
def all_usernames_request():
	allusernames_data = read_json_db(users_db)

	#list of all the products to be sent to front end
	usernames_list = []

	for user in allusernames_data:
		usernames_list.append(user['username'])

	return flask.jsonify(usernames_list)





##### Reading All products API #####
#CRUD READ.
@app.route("/readProducts" , methods=['POST'])
def allproducts_request():
	allproducts_data = read_json_db(products_db)

	#list of all the products to be sent to front end
	products_list = []

	for product in allproducts_data:
		selected_product = Product(product['code'], product['name'],product['owner'], product['price'], product['type'] ,product['quantity'],  product['unit'], product['access'])
		serialized_product = selected_product.to_dict()
		products_list.append(serialized_product)

	return flask.jsonify(products_list)






##### Searching API #####
#CRUD UPDATE.
#searching products by product name or owner name.
@app.route("/query" , methods=['POST'])
def receive_search_query():
	query = flask.request.get_json()  
	search_type = query.get("check_type")
	search_value = query.get("query_value")
	allproducts_data = read_json_db(products_db)

	#list of all the selected products to be sent to front end
	sent_products_list = []
	products_added = False
	if search_type == "product":
		#If product, loop over all products and add selected to list
		for prod in allproducts_data:
			if prod["name"].lower() == search_value.lower():
				selected_product = Product(prod['code'], prod['name'],prod['owner'], prod['price'], prod['type'] ,prod['quantity'],  prod['unit'], prod['access'])
				#return all products with this product name
				sent_products_list.append(selected_product)
		products_added = True

	elif search_type == "owner":
		#If owner, loop over all products and add products belong to this owner to list.
		for prod in allproducts_data:
			if prod["owner"].lower() == search_value.lower():
				selected_product = Product(prod["code"], prod["name"],prod["owner"], prod["price"], prod["type"] ,prod["quantity"],  prod["unit"], prod["access"])
				#return all products belongs to this owner
				sent_products_list.append(selected_product)
		products_added = True
	
	if products_added:
		serialized_products = [product.to_dict() for product in sent_products_list]
		return flask.jsonify(serialized_products)



##### Write one product API #####
#CRUD CREATE.
##### Update one product API #####
#CRUD UPDATE.
@app.route("/writeProduct" , methods=['POST'])
def receive_product():
	data = flask.request.get_json()
	code = data.get("code")
	name = data.get("name")
	owner = data.get("owner")
	price = data.get("price")
	type = data.get("type")
	quantity = data.get("quantity")
	access = data.get("access")
	unit = data.get("unit")

	#convert access from string to int to fit in product class and in DB.
	#1 means personal, 2 means shared
	access_as_num = 0
	if access == "personal":
		access_as_num = 1
	elif access == "shared":
		access_as_num = 2

	product_exist = False
	
	new_product = Product(code,name,owner,price,type,quantity,unit,access_as_num)

	new_product_dict = new_product.to_dict()
	#loop over DB, if product exists, rewrite it, else, add it.
	allproducts_data = read_json_db(products_db)
	for prod in allproducts_data: 
		if prod['code'] == new_product.product_code:
			product_exist = True
			break

	if product_exist:
		prod['code'] = new_product.product_code
		prod['name'] = new_product.product_name
		prod['owner'] = new_product.product_owner
		prod['price'] = new_product.product_price
		prod['type'] = new_product.product_type
		prod['quantity'] = new_product.product_quantity
		prod['unit'] = new_product.product_unit
		prod['access'] = new_product.product_access

		ALL_products_str = json.dumps(allproducts_data)
		delete_record_helper(products_db, ALL_products_str)

	else:
		write_json_db(products_db ,new_product_dict)
		#1 means product inserted successfully in DB

	return flask.jsonify(1)


##### Delete one product API #####
#CRUD DELETE.
@app.route("/deleteProduct" , methods=['POST'])
def receive_deleted_product():
	data = flask.request.get_json()
	deleted_code = data.get("deleted_record_code")
	old_products_list = read_json_db(products_db)
	new_products_list = []
	for product in old_products_list:
		if product['code'] != deleted_code:
			new_products_list.append(product)

	if len(new_products_list) < len(old_products_list):
		ALL_data_str = json.dumps(new_products_list)
		delete_record_helper(products_db, ALL_data_str)
		#1 means product deleted successfully.
		return flask.jsonify({'message': "1"})
	else:
		#0 means product not exist.
		return flask.jsonify({'message': "0"})