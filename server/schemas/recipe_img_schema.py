from . import ma, fields, validate, validates, Recipe, datetime, ingredient_schema, FileSize

class RecipeImgSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RecipeImg
        load_instance = True
        ordered = True
        partial = ('id', 'user')

    name = fields.String()

    name = fields.String()
    img = fields.File(
        required=True,
        validate=FileSize(min="1 MiB", max="2 MiB")
        )
    mimetype = fields.String()
    recipe_id = fields.String()






recipe_img_schema = RecipeImgSchema()
recipes_img_schema = RecipeImgSchema(many=True)