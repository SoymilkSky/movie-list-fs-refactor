CREATE DATABASE movielist;

USE movielist;

CREATE TABLE movies (
  id INTEGER AUTO_INCREMENT,
  moviename TINYTEXT NOT NULL,
  watched BOOLEAN NOT NULL,
  PRIMARY KEY(id)
);

