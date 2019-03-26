import json

from flask import Flask, request
from flask_restful import Resource, Api
import mysql.connector as mysql

from manager import Manager
import settings


class SignUp(Resource):
    """Manage signup process"""

    def post(self):
        try:
            # Parse JSON data
            req = json.loads(request.data.decode('UTF-8'))

            # Get data from request body
            email = req['email']
            password = req['password']
            name = req['name']
            surname = req['surname']
            birthdate = req['birthdate']

            # Insert new user
            manager.insert_user(email,
                                password,
                                name,
                                surname,
                                birthdate)

            return {"status": 200}, 200
        except ValueError:
            return {"status": 500, "error": "Email already exists"}, 500


class Login(Resource):
    """Manage login process"""

    def post(self):
        # Parse JSON data
        req = json.loads(request.data.decode('UTF-8'))

        # Get data from request body
        email = req['email']
        password = req['password']

        # Check if user exists and password is correct
        if manager.login_user(email, password):
            return {"status": 200, "login": "Successful"}, 200
        else:
            return {"status": 401, "error": "Wrong email or password"}, 401


class Events(Resource):
    """Manages events requests"""

    def get(self):
        pass
    

# Init flask
app = Flask(__name__)
api = Api(app)

PORT = 9543

# Create new db manager
manager = Manager(settings.host,
                  settings.username,
                  settings.passwd,
                  settings.database,
                  settings.charset)

# Routes configuration
api.add_resource(SignUp, '/signup/')
api.add_resource(Login, '/login/')


if __name__ == '__main__':
    try:
        # Connect to DB
        manager.connect()

        # Start API
        app.run(host='0.0.0.0', port=PORT)
    finally:
        manager.close()
