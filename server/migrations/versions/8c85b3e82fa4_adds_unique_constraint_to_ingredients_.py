"""Adds unique constraint to ingredients model

Revision ID: 8c85b3e82fa4
Revises: 0737feec5745
Create Date: 2024-04-30 14:51:11.136146

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8c85b3e82fa4'
down_revision = '0737feec5745'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ingredients', schema=None) as batch_op:
        batch_op.create_unique_constraint('ingredient_recipe_uc', ['id', 'recipe_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ingredients', schema=None) as batch_op:
        batch_op.drop_constraint('ingredient_recipe_uc', type_='unique')

    # ### end Alembic commands ###
