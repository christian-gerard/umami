from . import ma, fields, validate, validates, Food, datetime

class FoodSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Food
        load_instance = True
        ordered = True
        partial = ('id',)

    name = fields.String(
        required=True,
        validate=validate.Length(
            max=20,
            error="Name must not be more than 20 characters")
        )

    body = fields.String(
        require=True, 
        validate=validate.Length(
            min=10,
            max=40000, 
            error="Body must be between 10 and 40,000 characters")
        )


    ingredients = fields.Nested('IngredientSchema')

recipe_schema = FoodSchema()
recipes_schema = FoodSchema(many=True)