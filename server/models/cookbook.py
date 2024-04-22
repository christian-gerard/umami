from . import SerializerMixin, validates, re, db
from sqlalchemy.ext.hybrid import hybrid_property
from config import flask_bcrypt
from datetime import datetime
import re

class Cookbook(db.Model, SerializerMixin):
    # # # # # Table Name
    __tablename__ = 'cookbooks'

    # # # # # Attribute
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))
    created_at = db.Column(db.DateTime, default=datetime.now())

    # # # # # Relationship
    user = db.relationship('User', back_populates='cookbooks')
    recipe = db.relationship('Recipe', back_populates='cookbooks')

    # # # # # Serialize


    # # # # # Representation
    def __repr__(self):
        return f""" 
            <CookBook {self.id}
                name: {self.name}
                created_at: {self.created_at}
                />
        """

    # # # # # Validate
