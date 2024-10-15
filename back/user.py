import hashlib

#stores username and hashed password
class User:
    __username = ""
    __password = ""
    is_admin = False

    #hashes the password
    def __hash_pass(self,password):
        return hashlib.sha256(password.encode()).hexdigest()

    def __init__(self, username, password, is_admin):
        self.is_admin = is_admin
        self.set_username(username)
        self.set_password(password)
        

    #returns username
    @property
    def get_username(self):
        return self.__username
    
    #admins only can create a username for user.
    def set_username(self, username):
            if username != "":
                self.__username = username           

     #returns hashed password   
    @property
    def get_password(self):
        return self.__password
    
    def set_password(self, password):
        #asumes no one will add empty password except admin when granting username
        if password == "":
            self.__password = password
        else: 
            self.__password = self.__hash_pass(password)
    
    #serialize object of User to be a json object
    def to_dict(self):
        return {
            'username': self.__username,
            'password': self.__password,
            'is_admin': self.is_admin
        }