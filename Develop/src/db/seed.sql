-- Connect to the database
\c employees

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Team Lead', 140000, 1),
    ('Salesman', 85000, 1),
    ('Senior Engineer', 152500, 2),
    ('Software Developer', 135000, 2),
    ('Financial Technician', 170000, 3),
    ('Accountant', 120000, 3),
    ('Criminal Lawyer', 200000, 4),
    ('Civil Lawyer', 200000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jane', 'Doe', 1, NULL),
    ('Lebron', 'James', 2, 1),
    ('Kyrie', 'Irving', 3, NULL),
    ('Steph', 'Curry', 4, 3),
    ('Devin', 'Booker', 5, NULL),
    ('Marcus', 'Smart', 6, 5),
    ('Isaiah', 'Thomas', 7, NULL),
    ('Tim', 'Duncan', 8, 7);