DROP DATABASE IF EXISTS emp;
CREATE DATABASE emp;
USE emp;

CREATE TABLE department (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    name varchar(30) not null 
);

CREATE TABLE role (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);