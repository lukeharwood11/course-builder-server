CREATE DATABASE course_builder;
use course_builder;
DROP TABLE if EXISTS users;
DROP TABLE if EXISTS activeUsers;
-- user table for query
CREATE TABLE users (
    firstName varchar(50),
    lastName varchar(50),
    password varchar(200),
    type varchar(20), -- teacher/student
    email varchar(50) UNIQUE KEY,
    id int auto_increment PRIMARY KEY
);
CREATE TABLE activeUsers (
    userId int PRIMARY KEY,
    refreshToken varchar(500)
);
-- select statements for convenience
SELECT *
FROM users;
SELECT *
FROM activeUsers;