from . import ma, fields, validate, validates, RecipeImg, datetime, ingredient_schema

class RecipeImgSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RecipeImg
        load_instance = True
        ordered = True
        partial = ()

    name = fields.String()
    img = fields.String(
        required=True
        )
    mimetype = fields.String()
    recipe_id = fields.String()



recipe_img_schema = RecipeImgSchema()
recipes_img_schema = RecipeImgSchema(many=True)