from flask import request, session, g
from time import time
from flask_restful import Resource
from config import app, db, api
from werkzeug.exceptions import NotFound
from functools import wraps
import ipdb


if __name__ == "__main__":
    app.run(port=5555, debug=True)