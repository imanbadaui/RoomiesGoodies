#class to list all the products info at home.
class Product:
    product_code = ""
    product_name = ""
    product_owner = ""
    product_price = 0.0
    product_quantity = 0.0
    product_type = ""
    product_unit = ""
    product_access = 0 #personal 1, shared 2
   
   #receives the username to be stored as the owner name.
    def __init__(self, product_code, product_name,productOwnerUsername, product_price, product_type, product_quantity, product_unit, product_access):
        self.product_code = product_code
        self.product_name = product_name
        self.product_owner = productOwnerUsername
        self.product_price = product_price
        self.product_type = product_type
        self.product_quantity = product_quantity
        self.product_unit = product_unit
        self.product_access = product_access 

    def to_dict(self):
        return {
            'code':  self.product_code,
            'name': self.product_name,
            'owner': self.product_owner,
            'price': self.product_price,
            'type': self.product_type,
            'quantity': self.product_quantity,
            'unit':  self.product_unit,
           'access' : self.product_access
        }