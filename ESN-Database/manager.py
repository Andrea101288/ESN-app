import mysql.connector as mysql


class Manager:
    """This class manages all the connection and operations on the ESN database"""

    def __init__(self, host, username, password, database, charset="UTF8"):
        """Constructor function"""
        # Get credentials to enstablish connection
        self.host = host
        self.username = username
        self.password = password
        self.database = database
        self.charset = charset

        # Database stuff
        self.connection = None
        self.cursor = None

    def connect(self):
        """Connect to database"""
        self.connection = mysql.connect(host=self.host,
                                        user=self.username,
                                        password=self.password,
                                        database=self.database)
        self.cursor = self.connection.cursor()

    def close(self):
        """Closes the connection to the database"""
        self.cursor.close()
        self.connection.close()

    def insert_event(self, nid, name, start_date, start_time, end_date, end_time, place, price, meeting_point):
        """Insert events in the database"""
        try:
            # Prepare query
            query = "INSERT INTO event VALUES({0}, '{1}', '{2}', '{3}',\
                    '{4}', '{5}', '{6}', '{7}', '{8}')".format(nid,
                                                               name,
                                                               start_date,
                                                               start_time,
                                                               end_date,
                                                               end_time,
                                                               place,
                                                               price,
                                                               meeting_point)
            # Execute query
            self.cursor.execute(query)
            self.connection.commit()

        except mysql.Error as e:
            if e.errno == 1062:
                print("Entry '{0}' exists. Skipping".format(nid))
            else:
                print("Unknown error! Exiting...")
                raise e

    def insert_user(self, email, password, name, surname, birthdate):
        """Insert user in the database"""
        try:
            # Prepare query
            query = "INSERT INTO erasmusUser VALUES('{0}', '{1}', '{2}', '{3}', '{4}')".format(email,
                                                                                               password,
                                                                                               name,
                                                                                               surname,
                                                                                               birthdate)

            # Execute query
            self.cursor.execute(query)
            self.connection.commit()

        except mysql.Error as e:
            if e.errno == 1062:
                raise ValueError
            else:
                print("Unknown error! Exiting...")
                raise e
