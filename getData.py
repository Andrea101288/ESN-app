
from bs4 import BeautifulSoup
import json
from firebase import firebase
import requests
import xml.etree.ElementTree as ET
import lxml
import ssl
from lxml import etree
from datetime import datetime

# just beacuse we don't have many events
# this code can be deleted then

firebase = firebase.FirebaseApplication('https://internetservicesandapplication.firebaseio.com/', authentication = None)
event = {}
eventsArray = []
try:
    result = requests.get("https://www.esnurbino.it/api/v1/events.xml", verify = False)
except:
    print("getRequest Error!")   
    
et = ET.fromstring(result.text)
        
for eventes in et:
    event = {}
    event['startDate'] = eventes[1].text.split("T")[0]    
    event['startDateY'] = event['startDate'].split("-")[0]
    event['startDateM'] = int(event['startDate'].split("-")[1])
    event['startDateD'] = event['startDate'].split("-")[2] 
    datetime_object = datetime( int(event['startDateY']), int(event['startDateM']), int(event['startDateD']))        
    
    if datetime_object > datetime.today():        
        event['nid'] = eventes[15].text
        event['title'] = eventes[0].text.split(">")[1].split("<")[0]
        result = firebase.put('/events/' + event['nid'], 'name' , event['title'])
        event['startDate'] = eventes[1].text.split("T")[0]
        result = firebase.put('/events/' + event['nid'], 'startDate' , event['startDate'])
        event['endDate'] = eventes[2].text.split("T")[0]
        if event['startDate'] != event['endDate'] :    
            result = firebase.put('/events/' + event['nid'], 'endDate' , event['endDate']) 
        event['picture'] = eventes[3]
        event['place'] = eventes[6].text
        result = firebase.put('/events/' + event['nid'], 'place' , event['place'])
        event['prize'] = eventes[7].text
        result = firebase.put('/events/' + event['nid'], 'prize' , event['prize'])
        #event['city'] = eventes[1][4].text
        #result = firebase.put('/events/' + eventes[0].text, 'city' , event['city'])
        #event['country'] = eventes[1][13].text
        #result = firebase.put('/events/' + eventes[0].text, 'country' , event['country'])
        #event['date'], event['time'] = (eventes[3].text).split('-')
        #result = firebase.put('/events/' + eventes[0].text, 'date' , event['date'])
        #result = firebase.put('/events/' + eventes[0].text, 'time' , event['time'])
    
    eventsArray.append(event)
    
print(eventsArray) 