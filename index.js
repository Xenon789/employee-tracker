const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');

//connects to database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    function employeeTracker() {
        inquirer.prompt(choices).then((answers) => {
            //views the department in database
            if (answers.startingPrompt === 'View All Departments') {
                db.query(`SELECT * FROM department`, (err, res) => {
                    if (err) throw err;
                    console.log("Viewing All Departments: ");
                    console.table(res);
                    employeeTracker();
                });
            } else if (answers.startingPrompt === 'View All Positions') {
                db.query(`SELECT * FROM pos`, (err, res) => {
                    if (err) throw err;
                    console.log("Viewing All Positions: ");
                    console.table(res);
                    employeeTracker();
                });
            } else if (answers.startingPrompt === 'View All Employees') {
                db.query(`SELECT * FROM employee`, (err, res) => {
                    if (err) throw err;
                    console.log("Viewing All Employees: ");
                    console.table(res);
                    employeeTracker();
                });
            } else if (answers.startingPrompt === 'Add Department') {
                inquirer.prompt(addDepartment).then((answers) => {
                    db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${answers.department} to the database.`)
                        employeeTracker();
                    });
                })
            } else if (answers.startingPrompt === 'Add Position') {
                //querying the database for positions in department
                db.query(`SELECT * FROM department`, (err, res) => {
                    if (err) throw err;
    
                    inquirer.prompt(addPosition).then((answers) => {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].name === answers.deptName) {
                                var department = res[i];
                            }
                        }
    
                        db.query(`INSERT INTO pos (title, salary, department_id) VALUES (?, ?, ?)`, [answers.pos, answers.salary, department.id], (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${answers.pos} to the database.`)
                            employeeTracker();
                        });
                    })
                });
            } else if (answers.startingPrompt === 'Add New Employee') {
                //calling the database to acquire the positions and managers
                db.query(`SELECT * FROM employee, pos`, (err, res) => {
                    if (err) throw err;
    
                    inquirer.prompt(addEmployee).then((answers) => {
                        //comparing the res and storing it into the variable
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].title === answers.pos) {
                                var pos = res[i];
                            }
                        }
    
                        db.query(`INSERT INTO employee (first_name, last_name, pos_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, pos.id, answers.manager.id], (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                            employeeTracker();
                        });
                    })
                });
            } else if (answers.startingPrompt === 'Update Employee') {
                //calling the database to acquire the positions and managers
                db.query(`SELECT * FROM employee, pos`, (err, res) => {
                    if (err) throw err;
    
                    inquirer.prompt(updateEmployee).then((answers) => {
                        //comparing the res and storing it into the variable
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].last_name === answers.employee) {
                                var name = res[i];
                            }
                        }
    
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].title === answers.pos) {
                                var pos = res[i];
                            }
                        }
    
                        db.query(`UPDATE employee SET ? WHERE ?`, [{pos_id: pos}, {last_name: name}], (err, res) => {
                            if (err) throw err;
                            console.log(`Updated ${answers.employee}\'s position to the database.`)
                            employeeTracker();
                        });
                    })
                });
            } else if (answers.startingPrompt === 'Log Out') {
                db.end();
                console.log("Sad To See You Go!");
            }
        })
    }
    employeeTracker();
});


let choices = [
    {
        type: 'list',
        name: 'startingPrompt',
        message: 'Please select an option: ',
        choices: ['View All Departments', 'View All Positions', 'View All Employees', 'Add Department', 'Add Position', 'Add New Employee', 'Update Employee', 'Log Out']
    }
]

let addDepartment = [
    {
        type: 'input',
        name: 'deptName',
        message: 'Please Enter A Department Name: ',
        validate: departmentInput => {
            if (departmentInput) {
                return true;
            } else {
                console.log('Please Add A Department: ');
                return false;
            }
        }
    }
]

let addPosition = [
    {
        //adking for name of position
        type: 'input',
        name: 'pos',
        message: 'Please Enter Name Of Position: ',
        validate: posInput => {
            if (posInput) {
                return true;
            } else {
                console.log('Please Enter A Position!');
                return false;
            }
        }
    },
    {
        //asking for salary
        type: 'input',
        name: 'salary',
        message: 'Please Enter The Salary Of Said Position: ',
        validate: salaryInput => {
            if (salaryInput) {
                return true;
            } else {
                console.log('Please Enter A Salary!');
                return false;
            }
        }
    },
    {
        //asking for department of the position
        type: 'list',
        name: 'deptName',
        message: 'Please Enter The Department For The Position: ',
        choices: () => {
            var array = [];
            for (var i = 0; i < res.length; i++) {
                array.push(res[i].name);
            }
            return array;
        }
    }
]

let addEmployee = [
    {
        //asking for employee firstname as input
        type: 'input',
        name: 'firstName',
        message: 'Please Enter The Employee\'s first name: ',
        validate: firstNameInput => {
            if (firstNameInput) {
                return true;
            } else {
                console.log('Please Add A First Name!');
                return false;
            }
        }
    },
    {
        //asking for employee lastname as input
        type: 'input',
        name: 'lastName',
        message: 'Please Enter The Employee\'s last name: ',
        validate: lastNameInput => {
            if (lastNameInput) {
                return true;
            } else {
                console.log('Please Add A Last Name!');
                return false;
            }
        }
    },
    {
        //asking for the employee's position
        type: 'list',
        name: 'position',
        message: 'Please Enter The Employee\'s Position: ',
        choices: () => {
            var array = [];
            for (var i = 0; i < res.length; i++) {
                array.push(res[i].title);
            }
            var newArray = [...new Set(array)];
            return newArray;
        }
    },
    {
        //asking for the employee's manager
        type: 'input',
        name: 'manager',
        message: 'Please Enter The Employee\'s Manager: ',
        validate: managerInput => {
            if (managerInput) {
                return true;
            } else {
                console.log('Please Add A Manager!');
                return false;
            }
        }
    }
]

let updateEmployee = [
    {
        //select an employee from list to update
        type: 'list',
        name: 'employee',
        message: 'Please Select An Employee: ',
        choices: () => {
            var array = [];
            for (var i = 0; i < res.length; i++) {
                array.push(res[i].last_name);
            }
            var employeeArray = [...new Set(array)];
            return employeeArray;
        }
    },
    {
        //updating position of employee
        type: 'list',
        name: 'pos',
        message: 'Please Enter The Employee\'s New Position: ',
        choices: () => {
            var array = [];
            for (var i = 0; i < res.length; i++) {
                array.push(res[i].title);
            }
            var newArray = [...new Set(array)];
            return newArray;
        }
    }
]