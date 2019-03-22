
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


conn = MySQLdb.connect(host='localhost',user='root',passwd='Jago2009',db='esnurbino')
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
        
        nid = event['nid'] = eventes[15].text
        name = event['title'] = eventes[0].text.split(">")[1].split("<")[0]
        endDate = event['endDate'] = eventes[2].text.split("T")[0]
        startTime = event['startTime'] = eventes[1].text.split("T")[1].split("+")[0]
        endTime = event['endTime'] = eventes[2].text.split("T")[1].split("+")[0]
        
        if event['startDate'] == event['endDate'] :  
            endDate = NULL            
        #event['picture'] = eventes[3]
        place = event['place'] = eventes[6].text
        if event['place'] == "" :
            place = NULL
        prize = event['prize'] = eventes[7].text
        if event['prize'] == "" :
            prize = NULL
        meetingPoint = event['meetingPoint'] = eventes[9].text
        if event['meetingPoint'] == "" :
            meetingPoint = NULL
        try:
            cur.execute('USE esnurbino')
            sql = "INSERT INTO events ( name , startDate, startTime, endDate, endTime, place, prize, meetingPoint ) VALUES({},{},{},{},{},{},{},{})"
            val = (name , startDate, startTime, endDate, endTime, place, prize, meetingPoint) 
            cur.execute(sql, val)
            conn.commit()
            
        except:
            print("ERRORE NELL INSERIMENTO DEI DATI")
        time.sleep(1)
        conn.close()
        
        # eventsArray.append(event)
    