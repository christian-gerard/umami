from . import SerializerMixin, validates, re, db
from sqlalchemy.ext.hybrid import hybrid_property
from config import flask_bcrypt
from datetime import datetime
import re

class Ingredient(db.Model, SerializerMixin):
    # # # # # Table Name
    __tablename__ = 'ingredients'

    # # # # # Attribute
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20))
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    food_id = db.Column(db.Integer, db.ForeignKey('foods.id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))

    # # # # # Relationship
    food = db.relationship('Food', back_populates='ingredients')
    recipe = db.relationship('Recipe', back_populates='ingredients')


    # # # # # Serialize


    # # # # # Representation
    def __repr__(self):
        return f""" 
            <Ingredient {self.id}
                name: {self.name}
                created_at: {self.created_at}
                />
        """

    # # # # # Validate