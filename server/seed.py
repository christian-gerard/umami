from faker import Faker
from config import app
from models.__init__ import db
from models.user import User
from models.recipe import Recipe
from models.cookbook import Cookbook
from models.cookbook import Cookbook
import sys
import random
from rich import print
import ipdb

fake = Faker()

with app.app_context():
    # # # # # BEGIN SEED
    print('\n[purple]------------- BEGIN ------------[/purple]')
    print('\n')

    # # # # # Clean Database
    print('[purple]Cleaning Database 🧽 [/purple]...\n')
    try:
        User.query.delete()
        Cookbook.query.delete()
        Recipe.query.delete()
        db.session.commit()
        print('\t[green]Cleaning Complete[/green] ✅\n')
    except Exception as e:
        print('\t[red]Cleaning Failed[/red] 😞\n')
        sys.exit(1)