USE emp;

INSERT into department(id,name)
VALUES (1, "HR");

INSERT into department(id,name)
VALUES (2, "Finance");

INSERT into department(id,name)
VALUES (3, "Marketing");

INSERT into department(id,name)
VALUES (4, "IT");

INSERT into role (id,title, salary, department_id)
VALUES (1, "HR Director", 80000, 1);
INSERT into role (id,title, salary, department_id)
VALUES (2, "HR Intern", 50000, 1);

INSERT into role (id,title, salary, department_id)
VALUES (3, "FI Director", 90000, 2);
INSERT into role (id,title, salary, department_id)
VALUES (4, "FI Intern", 50000, 2);

INSERT into role (id,title, salary, department_id)
VALUES (5, "MK Director", 100000, 3);
INSERT into role (id,title, salary, department_id)
VALUES (6, "MK Intern", 50000, 3);

INSERT into role (id,title, salary, department_id)
VALUES (7, "IT Director", 120000, 4);
INSERT into role (id,title, salary, department_id)
VALUES (8, "IT Intern", 50000, 4);

INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (4, "Ron","Swanson", 2, 4);
INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (5, "Lemon","Drizzle", 1, null);

INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (6, "Blueberry","Tacoville", 4, null);
INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (7, "Baron","Pinoodle", 4, null);

INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (8, "Axel","Rose", 4, 6);
INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (9, "Eddie","Vedder", 1, null);

INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (3, "Iggy","Pop", 3, 7);
INSERT into employee (id,first_name, last_name, role_id, manager_id)
VALUES (2, "Janis","Joplin", 8, 9);