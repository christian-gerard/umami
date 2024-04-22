from faker import Faker
from config import app
from models.__init__ import db
from models.user import User
from models.recipe import Recipe
from models.cookbook import Cookbook
from models.ingredient import Ingredient
from models.food import Food


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
        Ingredient.query.delete()
        Food.query.delete()
        db.session.commit()
        print('\t[green]Cleaning Complete[/green] ✅\n')
    except Exception as e:
        print('\t[red]Cleaning Failed[/red] 😞\n')
        sys.exit(1)

    # # # # # Generate Users
    print('[purple]Generating Users 🗣  [/purple]...\n')
    try:
        users = []
        test_user = User(
                username='test', 
                email='test@gmail.com', 
                role=1 
                )
        test_user.password_hash = 'Password1!'
        users.append(test_user)

        for _ in range(10):
            user = User(
                username=fake.first_name(), 
                email=fake.email(), 
                role=1 
                )
            user.password_hash = 'Password1!'
            users.append(user)
        db.session.add_all(users)
        db.session.commit()
        print('\t[green]Users Complete[/green] ✅\n')
    except Exception as e:
        print('\t[red]User Generation Failed[/red] 😞\n' + str(e))
        sys.exit(1)


    # # # # # Generate Food
    print('[purple]Generating Food 🗣[/purple]  ...\n')
    try:

        print('\t[green]Food Complete[/green] ✅\n')
    except Exception as e:
        print('\t[red]Food Generation Failed[/red] 😞\n' + str(e))
        sys.exit(1)