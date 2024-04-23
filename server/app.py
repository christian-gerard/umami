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

class Users(Resource):
    def get(self):
        pass

api.add_resource(Users, '/users')


if __name__ == "__main__":
    app.run(port=5555, debug=True)