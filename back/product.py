import User
#class to list all the products info at one's home.
class Product:
    __product_name = ""
    __product_owner = ""
    #quantity and unit
    __quantity_tuple = (0, "")
    __product_code = 0
    __product_price = 0.0
    __is_shared = False
   
    def __init__(self, product_name, quantity_tuple, product_code, product_price, is_shared):
        self.__product_name = product_name
        self.__quantity_tuple = quantity_tuple
        self.__product_code = product_code
        self.__product_price = product_price
        self.__is_shared = is_shared
        #once a new product added,it will auto add the owner name as the username.
        #only owner of product can add it.
        self.__product_owner = User.__username 
       

    #only owner of a product can change ownership of that product.
    @__product_owner.setter
    def set_owner(self, new_owner):
        if self.__product_owner == User.__username:
            self.__product_owner = new_owner

    #only owner of a product can change name of that product.
    @__product_name.setter
    def set_name(self, new_name):
        if self.__product_owner == User.__username:
            self.__product_name = new_name

    #only owner of a product can change quantity of that product.
    @__product_owner.setter
    def set_quantity(self, new_quantity):
        if self.__product_owner == User.__username:
            self.__quantity_tuple = new_quantity
    
    #only owner of a product can change code of that product.
    @__product_code.setter
    def set_code(self, new_code):
        if self.__product_owner == User.__username:
            self.__product_code = new_code

    #only owner of a product can change price of that product.
    @__product_owner.setter
    def set_price(self, new_price):
        if self.__product_owner == User.__username:
            self.__product_price = new_price

    #only owner of a product can change access of that product.
    @__is_shared.setter
    def set_is_shared(self, new_access):
        if self.__product_owner == User.__username:
            self.__is_shared = new_access
            

    @property
    def get_name(self):
            return self.__product_name
    
    @property
    def get_owner(self):
        return self.__product_owner
    
    @property
    def get_code(self):
        return self.__product_code
    
    @property
    def get_price(self):
        return self.__product_price
    
    @property
    def get_quantity(self):
        return self.__quantity_tuple
    
    @property
    def get_access(self):
        return self.__is_shared