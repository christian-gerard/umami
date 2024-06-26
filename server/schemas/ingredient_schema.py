from . import ma, fields, validate, validates, Ingredient, datetime

class IngredientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ingredient
        load_instance = True
        ordered = True
        partial = ('id',)

    
    amount = fields.Integer()

    measurement_unit = fields.String(
        require=True, 
        validate=validate.OneOf(choices=['cups', 'fl oz', 'liters', 'pint', 'quart', 'oz', 'lbs', 'tbsp', 'tsp', 'serving']
            )
    )

    food_id = fields.Integer(required=True)
    recipe_id = fields.Integer(required=True)

    food = fields.Nested('FoodSchema')
    recipe = fields.Nested('RecipeSchema')

ingredient_schema = IngredientSchema()
ingredients_schema = IngredientSchema(many=True)