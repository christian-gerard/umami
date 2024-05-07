from . import ma, fields, validate, validates, Recipe, datetime, ingredient_schema

class RecipeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Recipe
        load_instance = True
        ordered = True
        partial = ('id', 'user')

    name = fields.String(
        validate=validate.Length(
            max=50,
            error="Title must be less than 50 characters")
        )

    steps = fields.String(
        require=True, 
        validate=validate.Length(
            min=10,
            max=40000, 
            error="Body must be between 10 and 40,000 characters")
        )

    category = fields.String()
    source = fields.String()
    recipe_img = fields.String()
    prep_time = fields.String()

    user_id = fields.Integer()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    user = fields.Nested('UserSchema')
    cookbooks = fields.Nested('CookbookSchema')
    ingredients = fields.Nested(
        'IngredientSchema',
        exclude=('recipe',),
        many=True
    )

recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)