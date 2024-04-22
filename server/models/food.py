from . import SerializerMixin, validates, re, db
from sqlalchemy.ext.hybrid import hybrid_property
from config import flask_bcrypt
from datetime import datetime
import re

class Food(db.Model, SerializerMixin):
    # # # # # Table Name
    __tablename__ = 'foods'

    # # # # # Attribute
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20))
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())

    # # # # # Relationship
    ingredients = db.relationship('Ingredient', back_populates='food')

    # # # # # Serialize


    # # # # # Representation
    def __repr__(self):
        return f""" 
            <Food {self.id}
                name: {self.name}
                created_at: {self.created_at}
                />
        """

    # # # # # Validate