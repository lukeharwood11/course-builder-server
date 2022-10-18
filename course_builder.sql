create database course_builder;
use course_builder;
drop table if exists users;
drop table if exists activeUsers;
-- user table for query
create table users (
    firstName varchar(50),
    lastName varchar(50),
    password varchar(200),
    type varchar(20), -- teacher/student
    email varchar(50) unique key,
    id int auto_increment primary key
);
create table activeUsers (
    userId int primary key,
    refreshToken varchar(500)
);
-- select statements for convenience
select *
from users;
select *
from activeUsers;