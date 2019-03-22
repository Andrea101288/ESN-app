
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

myHost='localhost'
myUser='root'
myPasswd='Jago2009'
myDb='esnurbino'
myCharSet = 'utf8'

def insertEventDb(sqlHost, sqlUser, sqlPasswd, sqlDb, eventId, eventName, eventStartDate, eventStartTime, eventEndDate, eventEndTime, eventPlace, eventPrize, eventMeetingPoint):
    
    conn = MySQLdb.connect(host=sqlHost,user=sqlUser,passwd=sqlPasswd,db=sqlDb,charset=myCharSet)
    cur = conn.cursor()
    
    try:
        cur.execute("USE "+ sqlDb)
        sql = "INSERT INTO events VALUES (" + eventId  + "," + eventName + "," + eventStartDate + "," + eventStartTime + "," + eventEndDate + "," + eventEndTime + "," + eventPlace + "," + eventPrize + "," + eventMeetingPoint + ");"
        cur.execute(sql)
        conn.commit()
        conn.close()
    except:
        print("ERRORE NELL INSERIMENTO DEI DATI")
        conn.close()
        
try:
    result = requests.get("https://www.esnurbino.it/api/v1/events.xml", verify = False)
except:
    print("getRequest Error!")   
    
et = ET.fromstring(result.text)
        
for eventes in et:
    event = {}
    startDate = event['startDate'] = eventes[1].text.split("T")[0]     
    startDateY = event['startDate'].split("-")[0]
    startDateM = event['startDate'].split("-")[1]
    startDateD = event['startDate'].split("-")[2]
    
    datetime_object = datetime( int(startDateY), int(startDateM), int(startDateD)) 
    
    
    #if datetime_object > datetime.now():
        
    nid = event['nid'] = eventes[15].text
    name = event['title'] = eventes[0].text.split(">")[1].split("<")[0]
    endDate = event['endDate'] = eventes[2].text.split("T")[0]
    startTime = event['startTime'] = eventes[1].text.split("T")[1].split("+")[0]
    endTime = event['endTime'] = eventes[2].text.split("T")[1].split("+")[0]
    place = event['place'] = eventes[6].text
    prize = event['prize'] = eventes[7].text
    meetingPoint = event['meetingPoint'] = eventes[9].text
    
    nid = "'" + str(int(nid)) + "'"
    name = "'" + name + "'"
    startDate = "'" + startDate + "'"
    startTime = "'" + startTime + "'"
    endTime = "'" + endTime + "'"        
    
    if event['startDate'] == event['endDate'] :  
        endDate = "NULL" 
    else:
        endDate = "'" + endDate + "'"
        
    if event['place'] == None :
        place = "NULL"
    else:  
        place = "'" + place + "'"
    if event['prize'] == None :
        prize = "NULL"
    else:
        prize = "'" + str(prize) + "'"
    if event['meetingPoint'] == None :
        meetingPoint = "NULL"
    else:
        meetingPoint = "'" + meetingPoint + "'"
    
    insertEventDb(myHost, myUser, myPasswd, myDb, nid, name, startDate, startTime, endDate, endTime, place, prize, meetingPoint)
   
    
    