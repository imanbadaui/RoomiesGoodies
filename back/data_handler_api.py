import json
import os
#accessing database 

# Read DB JSON data from a file
def read_json_db(file_path):
	try:
		file = open(file_path, 'r')
		#data is LIST of dicts
		data = json.load(file) 
		file.close()
	except:
		data = []
	return data

#write DB JSON data to a file
def write_json_db(file_path, new_data):
	data = read_json_db(file_path)
	file = open(file_path, 'a')
	#converts new-data dict to string
	new_data_str= json.dumps(new_data)
	new_data_str = new_data_str.replace(',', ',\n')
	new_data_str = new_data_str.replace('{', '{\n')
	new_data_str = new_data_str.replace('}', '\n}')

	if not data:
		file.write('[\n' + new_data_str + '\n]')
	else:
		#remove last char
		file.seek(0, os.SEEK_END)
		file.seek(file.tell() - 1)  # Move back to the last character
		file.truncate()
		file.write(',\n' + new_data_str + '\n]')

	file.close()