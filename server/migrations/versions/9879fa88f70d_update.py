"""UPDATE

Revision ID: 9879fa88f70d
Revises: f11fa21b4f44
Create Date: 2024-05-24 14:55:21.710610

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9879fa88f70d'
down_revision = 'f11fa21b4f44'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('foods', schema=None) as batch_op:
        batch_op.drop_column('description')
        batch_op.drop_column('type_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('foods', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type_id', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.VARCHAR(), nullable=True))

    # ### end Alembic commands ###