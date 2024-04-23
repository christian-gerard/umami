from flask import request, session, g
from time import time
from flask_restful import Resource
from config import app, db, api
from werkzeug.exceptions import NotFound
from functools import wraps
from models.user import User
from models.cookbook import Cookbook
from models.food import Food
from models.recipe import Recipe
from models.ingredient import Ingredient
import ipdb

# # # General Route
# # Error Handling
@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

# # Route Protection
# @app.before_request
# def before_request():
#     path_dict = {"entrybyid": Entry, "userbyid": User }
#     if request.endpoint in path_dict:
#         id = request.view_args.get("id")
#         record = db.session.get(path_dict.get(request.endpoint), id)
#         key_name = "prod" if request.endpoint == "productionbyid" else "crew"
#         setattr(g, key_name, record)

#     g.time = time()

def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return {"message": "Access Denied, please log in!"}, 422
        return func(*args, **kwargs)
    return decorated_function

@app.after_request
def after_request(response):  #! notice the response argument automatically passsed in
    diff = time() - g.time
    print(f"Request took {diff} seconds")
    response.headers["X-Response-Time"] = str(diff)
    return response





# # # REST API

# # # # # Users
class Users(Resource):
    def get(self):
        pass

    def post(self):
        pass

api.add_resource(Users, '/users')

class UserById(Resource):
    def get(self,id):
        pass

    def patch(self,id):
        pass

    def delete(self,id):
        pass

api.add_resource(UserById, '/users/<int:id>')



# # # # # Cookbooks
class Cookbooks(Resource):
    def get(self):
        pass

api.add_resource(Cookbooks, '/cookbooks')

class CookbookById(Resource):
    def get(self, id):
        pass

api.add_resource(CookbookById, '/cookbooks/<int:id>')



# # # # # Foods
class Foods(Resource):
    def get(self):
        pass

api.add_resource(Foods, '/foods')



# # # # # Recipes
class Recipes(Resource):
    def get(self):
        pass

    def post(self):
        pass

api.add_resource(Recipes, '/recipes')

class RecipeById(Resource):
    def get(self):
        pass

    def patch(self,id):
        pass

    def delete(self,id):
        pass

api.add_resource(RecipeById, '/recipes/<int:id>')



# # # # # Ingredients
class Ingredients(Resource):
    def get(self):
        pass

api.add_resource(Ingredients, '/ingredients')



# # # # # Run App
if __name__ == "__main__":
    app.run(port=5555, debug=True)