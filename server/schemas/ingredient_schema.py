from . import ma, fields, validate, validates, Ingredient, datetime

class IngredientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ingredient
        load_instance = True
        ordered = True
        partial = ('id',)

    amount = fields.String(
        validate=validate.Length(
            max=50,
            error="Title must be less than 50 characters")
        )

    measurement_unit = fields.String(
        require=True, 
        validate=validate.OneOf(choices=['cups', 'fluid ounces', 'liters']
            )
    )

    food_id = fields.Integer(required=True)
    recipe_id = fields.Integer(required=True)

    food = fields.Nested('FoodSchema')
    recipe = fields.Nested('RecipeSchema')

ingredient_schema = IngredientSchema()
ingredients_schema = IngredientSchema(many=True)