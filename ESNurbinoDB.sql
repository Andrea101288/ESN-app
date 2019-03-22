# DATABASE CREATION

CREATE DATABASE ESNurbino;
USE ESNurbino;

CREATE TABLE ErasmusUser(

username varchar(15) PRIMARY KEY,
password varchar(20) NOT NULL,
email varchar(200) NOT NULL,
nome varchar(20) NOT NULL,
cognome varchar(20) NOT NULL,
data_nascita varchar(20) NOT NULL

) Engine = InnoDB;

CREATE TABLE Events(

nid int(100) PRIMARY KEY,
name varchar(50) NOT NULL,
startDate varchar(50) NOT NULL,
startTime varchar(50) NOT NULL,
endDate varchar(50) ,
EndTime varchar(50) ,
place varchar(50),
prize varchar(50),
meetingPoint varchar(50)

) Engine = InnoDB;
