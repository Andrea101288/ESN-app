
from bs4 import BeautifulSoup
import json
from firebase import firebase
import requests
import xml.etree.ElementTree as ET
import lxml
import ssl
from lxml import etree
from datetime import datetime
import time
import MySQLdb

# just beacuse we don't have many events
# this code can be deleted then

conn = MySQLdb.connect(host='127.0.0.1',user='root',passwd='',db='esnurbino')
cur = conn.cursor()

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
    event['startDateM'] = event['startDate'].split("-")[1]
    event['startDateD'] = event['startDate'].split("-")[2]
    
    datetime_object = datetime( int(event['startDateY']), int(event['startDateM']), int(event['startDateD'])) 
    
    
    if datetime_object > datetime.now():
    
        event['nid'] = eventes[15].text
        event['title'] = eventes[0].text.split(">")[1].split("<")[0]
        event['startDate'] = eventes[1].text.split("T")[0]
        event['endDate'] = eventes[2].text.split("T")[0]
        if event['startDate'] == event['endDate'] :  
            event['endDate'] = NULL            
        #event['picture'] = eventes[3]
        event['place'] = eventes[6].text
        event['prize'] = eventes[7].text
        event['meetingPoint'] = eventes[9].text
        try:
            cur.execute('USE esnurbino')
            sql = "INSERT INTO events (name, startDate, endDate, place, prize, meetingPoint) VALUES (%s, %s, %s, %s, %d, %s)"
            val = ( event['title']  , event['startDate'] , event['endDate'] , event['place'] , event['prize'] , event['meetingPoint'])
            cur.execute(sql, val)
            
        except:
            print("ERRORE NELL INSERIMENTO DEI DATI")
        time.sleep(1)
        conn.close()
        
        # eventsArray.append(event)
    