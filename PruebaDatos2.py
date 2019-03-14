
from bs4 import BeautifulSoup
import json
from firebase import firebase
import requests
import xml.etree.ElementTree as ET
import lxml
import ssl
from lxml import etree

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
    event['title'] = eventes[0].text.split(">")[1].split("<")[0]
    result = firebase.put('/events/' + event['title'], 'name' , event['title'])
    event['place'] = eventes[1][1].text
    #result = firebase.put('/events/' + eventes[0].text, 'place' , event['place'])
    #event['address'] = eventes[1][2].text
    #result = firebase.put('/events/' + eventes[0].text, 'address' , event['address'])
    #event['city'] = eventes[1][4].text
    #result = firebase.put('/events/' + eventes[0].text, 'city' , event['city'])
    #event['country'] = eventes[1][13].text
    #result = firebase.put('/events/' + eventes[0].text, 'country' , event['country'])
    #event['date'], event['time'] = (eventes[3].text).split('-')
    #result = firebase.put('/events/' + eventes[0].text, 'date' , event['date'])
    #result = firebase.put('/events/' + eventes[0].text, 'time' , event['time'])
    
    eventsArray.append(event)
    
print(eventsArray) 