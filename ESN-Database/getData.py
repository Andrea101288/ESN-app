from datetime import datetime
import xml.etree.ElementTree as ET

import requests

from manager import Manager
import settings


# Create a new instance of db manager
manager = Manager(settings.host,
                  settings.username,
                  settings.passwd,
                  settings.database,
                  settings.charset)
manager.connect()

# Request events XML
try:
    result = requests.get("https://www.esnurbino.it/api/v1/events.xml")
except:
    print("Request Error!")
    raise ConnectionError()

# Parse the events
events = ET.fromstring(result.text)

# Loop through events
for event in events:
    # Extract start date
    start_date = event[1].text.split("T")[0]

    # Compute the date as a comparable object
    startDateY = int(start_date.split("-")[0])
    startDateM = int(start_date.split("-")[1])
    startDateD = int(start_date.split("-")[2])
    datetime_object = datetime(startDateY, startDateM, startDateD)

    # Check if event is not alredy finished
    # if datetime_object > datetime.now():

    # Extract all the interesting infos
    nid = event[15].text
    name = event[0].text.split(">")[1].split("<")[0]
    end_date = event[2].text.split("T")[0]
    start_time = event[1].text.split("T")[1].split("+")[0]
    end_time = event[2].text.split("T")[1].split("+")[0]
    place = event[6].text
    price = event[7].text
    meeting_point = event[9].text

    # Check if some of the field are empty
    # In case they are replace them with NULL
    if start_date == end_date:
        end_date = "NULL"

    if place == None:
        place = "NULL"

    if price == None:
        price = "NULL"

    if meeting_point == None:
        meeting_point = "NULL"

    # Insert the new event in the database
    manager.insert_event(nid,
                         name,
                         start_date,
                         start_time,
                         end_date,
                         end_time,
                         place,
                         price,
                         meeting_point)

# Close connection to the database
manager.close()
