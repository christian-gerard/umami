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
    name = db.Column(db.String(20), nullable=False, unique=True)
    type = db.Column(db.String(20), nullable=False)

    # # # # # Relationship
    ingredients = db.relationship('Ingredient', back_populates='food')

    # # # # # Serialize
    serialize_rules=('-ingredients',)

    # # # # # Representation
    def __repr__(self):
        return f""" 
            <Food {self.id}
                name: {self.name}
                created_at: {self.created_at}
                />
        """
    # # # # # Validate
    @validates('name')
    def validate_name(self, key, name):
        assert name, "Name must be provided"
       
    @validates('type')
    def validate_type(self, key, type):
        types = ('fruit', 'vegetable', 'grain', 'protein', 'dairy', 'oils'  )
        assert type in types, "Type must match the types listed: fruits, vegetables... "
        return type