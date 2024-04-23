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

    type = fields.String(
        require=True, 
        validate=validate.OneOf(
            choices=[
                'fruit', 
                'vegetable', 
                'grain', 
                'protein', 
                'dairy', 
                'oils']
            )
        )

    ingredients = fields.Nested('IngredientSchema')

food_schema = FoodSchema()
foods_schema = FoodSchema(many=True)