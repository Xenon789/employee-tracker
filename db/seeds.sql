-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('IT'),
  ('Finance'),
  ('Representative'),
  ('Customer Service');

-- Inserts positions of employee into pos table
INSERT INTO pos
  (title, salary, department_id)
VALUES
  ('Software Engineer', 95000, 1),
  ('Teller', 75000, 2),
  ('Accountant', 100000, 3),
  ('Representative', 60000, 4);

-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, pos_id, manager_id)
VALUES
  ('John', 'Doe', 1, 4),
  ('Jane', 'Doe', 2, 3),
  ('Bob', 'Marley', 3, 1),
  ('Ryan', 'Reynolds', 4, 5);