CREATE DATABASE snap_shotDB;

USE DATABASE snap_shotDB;

-- CREATE TABLE users (
--     id INTEGER(11) AUTO_INCREMENT NOT NULL,
--     first_name VARCHAR(50),
--     last_name VARCHAR(50),
--     email VARCHAR(50),
--     password VARCHAR(50),
--     PRIMARY KEY(id)
-- );


-- CREATE TABLE spots (
--     id INTEGER(14) AUTO_INCREMENT NOT NULL,
--     uploader_id INTEGER(11),
--     location VARCHAR(50),
--     historical BOOLEAN NULL,
--     vista BOOLEAN NULL,
--     streetart BOOLEAN NULL,
--     trendy BOOLEAN NULL,
--     nature BOOLEAN NULL,
--     tod VARCHAR(50) NULL,
--     popularity INTEGER(10) NULL,
--     PRIMARY KEY (id),
--     FOREIGN KEY (uploader_id) REFERENCES users(id)
-- );

-- CREATE TABLE favorites (
--     id INTEGER(14) AUTO_INCREMENT NOT NULL,
--     user_id INTEGER(11),
--     spot_id INTEGER(14),
--     PRIMARY KEY (id),
--     FOREIGN KEY (spot_id) REFERENCES spots(id)
-- );