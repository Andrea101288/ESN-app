# DATABASE CREATION

CREATE DATABASE IF NOT EXISTS ESNurbino;
USE ESNurbino;

CREATE TABLE IF NOT EXISTS erasmusUser(
    email varchar(128) PRIMARY KEY,
    password varchar(64) NOT NULL,
    name varchar(32) NOT NULL,
    surname varchar(32) NOT NULL,
    birthDate varchar(32) NOT NULL
)Engine = InnoDB;

CREATE TABLE IF NOT EXISTS event(
    nid int(64) PRIMARY KEY,
    name varchar(256) NOT NULL,
    startDate varchar(32) NOT NULL,
    startTime varchar(32) NOT NULL,
    endDate varchar(32),
    endTime varchar(32),
    place varchar(128),
    price varchar(128),
    meetingPoint varchar(128)
)Engine = InnoDB;
