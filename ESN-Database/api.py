from flask import Flask, request
from flask_restful import Resource, Api
import mysql.connector as mysql

from manager import Manager
import settings

class SignUp(Resource):
    def post(self):
        try:
            # Insert new user
            manager.insert_user(request.form['email'],
                                request.form['password'],
                                request.form['name'],
                                request.form['surname'],
                                request.form['birthdate'])
            return {"status": "200"}, 200
        except ValueError:
            return {"error": "Email already exists"}, 500

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


if __name__ == '__main__':
    try:
        # Connect to DB
        manager.connect()

        # Start API
        app.run(host='0.0.0.0', port=PORT)
    finally:
        manager.close()
