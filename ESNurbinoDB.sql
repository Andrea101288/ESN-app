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

name varchar(20) PRIMARY KEY,
startDate varchar(20) NOT NULL,
endDate varchar(20) ,
place varchar(20),
prize int(100),
meetingPoint varchar(20)

) Engine = InnoDB;
						   

