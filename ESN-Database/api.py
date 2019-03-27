import json

from flask import Flask, request
from flask_restful import Resource, Api
import mysql.connector as mysql

from manager import Manager
import settings


class SignUp(Resource):
    """Manage signup process"""

    def post(self):
        # Parse JSON data
        req = json.loads(request.data.decode('UTF-8'))

        # Get data from request body
        email = req['email']
        password = req['password']
        name = req['name']
        surname = req['surname']
        birthdate = req['birthdate']

        try:
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

        # Get hash from DB
        password_hash = manager.get_password_hash(email)

        # Check if user exists
        if password_hash is not None:
            return {"status": 200, "hash": password_hash}, 200
        else:
            return {"status": 401, "error": "Wrong email"}, 401


class Events(Resource):
    """Manages events requests"""

    def get(self, offset=0, limit=10):
        # Return value
        rv = []

        # Get events from DB
        events = manager.get_events(offset, limit)

        for event in events:
            tmp_event = {
                'nid': event[0],
                'name': event[1],
                'startDate': event[2],
                'startTime': event[3],
                'endDate': event[4],
                'endTime': event[5],
                'place': event[6],
                'price': event[7],
                'meetingPoint': event[8]
            }

            rv.append(tmp_event)

        return {"status": 200, "events": rv}, 200


# Init flask
app = Flask(__name__)
api = Api(app)

PORT = 8080

# Create new db manager
manager = Manager(settings.host,
                  settings.username,
                  settings.passwd,
                  settings.database,
                  settings.charset)

# Routes configuration
api.add_resource(SignUp, '/signup/')
api.add_resource(Login, '/login/')
api.add_resource(Events,
                 '/events/',
                 '/events/<offset>/',
                 '/events/<offset>/<limit>/')


if __name__ == '__main__':
    try:
        # Connect to DB
        manager.connect()

        # Start API
        app.run(host='0.0.0.0', port=PORT)
    finally:
        manager.close()
