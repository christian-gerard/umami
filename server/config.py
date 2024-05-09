from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os
import ipdb
from flask_cors import CORS

# # # # # App
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build')

load_dotenv()

# # # # # App Declaration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.environ.get("SESSION_SECRET")
app.config["SESSION_TYPE"] = "sqlalchemy"
app.config["SESSION_SQLALCHEMY_TABLE"] = "sessions"

# # # # # App + SQLAlchemy Connection
db = SQLAlchemy(app)
app.config["SESSION_SQLALCHEMY"] = db
migrate = Migrate(app, db)

# # # # # Rest API
api = Api(app, prefix="/api/v1")

# # # # # Session
session = Session(app)

# # # # # Bcrypt
flask_bcrypt = Bcrypt(app)

# # # # # Marshmallow
ma = Marshmallow(app)

# # # # # CORS
CORS(app)