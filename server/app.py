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
from schemas.user_schema import user_schema, users_schema
from schemas.cookbook_schema import cookbook_schema, cookbooks_schema
from schemas.food_schema import food_schema, foods_schema
from schemas.recipe_schema import recipe_schema, recipes_schema
from schemas.ingredient_schema import ingredient_schema, ingredients_schema
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

# def login_required(func):
#     @wraps(func)
#     def decorated_function(*args, **kwargs):
#         if 'user_id' not in session:
#             return {"message": "Access Denied, please log in!"}, 422
#         return func(*args, **kwargs)
#     return decorated_function

# @app.after_request
# def after_request(response):  #! notice the response argument automatically passsed in
#     diff = time() - g.time
#     print(f"Request took {diff} seconds")
#     response.headers["X-Response-Time"] = str(diff)
#     return response





# # # REST API

# # # # # Users
class Users(Resource):
    def get(self):
        try:
            users = users_schema.dump(User.query)
            return users, 200
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Users, '/users')

class UserById(Resource):
    def get(self,id):
        try:
            user = user_schema.dump(User.query.get(id))
            if user:
                return user, 200
            else:
                return {"Error": "User not found"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

    def patch(self,id):
        try:
            og = User.query.filter(User.id == id).first()
            if og:
                data = request.get_json()
                updated_entry = user_schema.load(data, instance=og, partial=True)
                db.session.commit()
                return user_schema.dump(updated_entry), 200
            else:
                return {"Error": f"Unable to find user with id {id}"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

    def delete(self,id):
        try:
            user = User.query.get(id)
            if user:
                db.session.delete(user)
                db.session.commit()
                return {}, 204
            else:
                return {"Error": "User not found"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(UserById, '/users/<int:id>')



# # # # # Cookbooks
class Cookbooks(Resource):
    def get(self):
        try:
            cookbooks = cookbooks_schema.dump(Cookbook.query)
            return cookbooks, 200
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Cookbooks, '/cookbooks')

class CookbookById(Resource):
    def get(self, id):
        try:
            cookbook = cookbook_schema.dump(Cookbook.query.get(id))
            if cookbook:
                return cookbook, 200
            else:
                return {"Error": "Cookbook not found"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(CookbookById, '/cookbooks/<int:id>')



# # # # # Foods
class Foods(Resource):
    def get(self):
        try:
            foods = foods_schema.dump(Food.query)
            return foods, 200
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Foods, '/foods')



# # # # # Recipes
class Recipes(Resource):
    def get(self):
        try:
            recipes = recipes_schema.dump(Recipe.query)
            return recipes, 200
        except Exception as e:
            return {"Error": str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            recipe = recipe_schema.load({
                "name" : data.get("name"),
                "steps" : data.get("steps"),
                "user_id" : session.get("user_id")})
            db.session.add(recipe)
            db.session.commit()
            return recipe_schema.dump(recipe), 201
        except Exception as e:
            db.session.rollback()
            return {"Error": str(e)}, 400

api.add_resource(Recipes, '/recipes')

class RecipeById(Resource):
    def get(self):
        try:
            recipe = recipe_schema.dump(Recipe.query.get(id))
            if recipe:
                return recipe, 200
            else:
                return {"Error": "Recipe not found"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

    def patch(self,id):
        try:
            og = Recipe.query.filter(Recipe.id == id).first()
            if og:
                data = request.get_json()
                updated_entry = recipe_schema.load(data, instance=og, partial=True)
                db.session.commit()
                return recipe_schema.dump(updated_entry), 200
            else:
                return {"Error": f"Unable to find recipe with id {id}"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

    def delete(self,id):
        try:
            recipe = Recipe.query.get(id)
            if recipe:
                db.session.delete(recipe)
                db.session.commit()
                return {}, 204
            else:
                return {"Error": "Recipe not found"}, 404
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(RecipeById, '/recipes/<int:id>')



# # # # # Ingredients
class Ingredients(Resource):
    def get(self):
        try:
            ingredients = ingredients_schema.dump(Ingredient.query)
            return ingredients, 200
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Ingredients, '/ingredients')



# # # # # Auth Flow

class Signup(Resource):
    def post(self):
        try:
            # Pass partial on load() method to avoid id requirement
            data = request.get_json()
            new_user = user_schema.load({"username": data.get('username'), "password_hash": data.get("_password_hash")})
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return user_schema.dump(new_user), 201
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Signup, '/signup')


class Login(Resource):
    def post(self):
        try:
            
            data = request.get_json()
            user = User.query.filter_by(username=data.get('username')).first()
            if user and user.authenticate(data.get('_password_hash')):
                session["user_id"] = user.id
                session["username"] = user.username
                return user_schema.dump(user), 200
            else:
                return {"Message": "Invalid Login"}, 422
        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        try:
            if "user_id" in session:
                del session['user_id']
                del session['username'] #! delete the entire key-value pair
                return {}, 204
            else:
                return {"Error": "A User is not logged in"}, 404

        except Exception as e:
            return {"Error": str(e)}, 400

api.add_resource(Logout, '/logout')

class CheckMe(Resource):
    def get(self):
        if "user_id" in session:
            user = db.session.get(User, session.get("user_id"))
            return user_schema.dump(user), 200
        else:
            return {"message": "Please log in"}, 400
        
api.add_resource(CheckMe, '/me')


# # # # # Run App
if __name__ == "__main__":
    app.run(port=5555, debug=True)