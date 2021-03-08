const mysql = require("mysql");
const inquirer = require("inquirer");
const promisemysql = require("promise-mysql");
const consoleTable = require("console.table");

const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "carrot",
    database: "emp"
}

const connection = mysql.createConnection(connectionProperties);

connection.connect((err) => {
    if (err) throw err;
    console.log("Employee Tracker");
    prompt();
});

function prompt() {
    inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Pick an action',
            choices: [
                "View all employees",
                "View all employees by role",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role",
                "Delete employee",
                "View total utilised department budget"
            ]
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all employees":
                    viewAll();
                    break;
                case "View all employees by role":
                    viewByRole();
                    break;
                case "View all employees by department":
                    viewByDept();
                    break;
                case "View all employees by manager":
                    viewByManager();
                    break;
                case "Add employee":
                    addEmp();
                    break;
                case "Add department":
                    addDept();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Update employee role":
                    updateRole();
                    break;
                case "Delete employee":
                    deleteEmployee();
                    break;
                case "View total utilised department budget":
                    viewDeptBudget();
                    break;
            }
        });


}

function viewAll() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,'',manager.last_name)AS manager 
                 FROM employee
                 LEFT JOIN employee manager on manager.id = employee.manager_id
                 INNER JOIN role ON (role.id = employee.role_id)
                 INNER JOIN department ON (department.id = role.department_id)
                 ORDER BY employee.id;`;
    connection.query(query, function(err, res) {
        if (err) return err;
        console.table(res);
        prompt();
    });

}

function viewByRole() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
FROM employee
LEFT JOIN role ON (role.id = employee.role_id)
LEFT JOIN department ON (department.id = role.department_id)
ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();

    })
}

function viewByDept() {
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();
    })
}

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();
    })
}

function enterName() {
    return ([{
            name: "first",
            type: "input",
            message: "Enter first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter last name: "
        }
    ]);
}
async function addEmp() {
    const addName = await inquirer.prompt(enterName());
    connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async(err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([{
            name: 'role',
            type: 'list',
            choices: () => res.map(res => res.title),
            message: 'What is the role of the employee?:'
        }]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`SELECT * FROM employee`, async(err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([{
                name: 'manager',
                type: 'list',
                choices: choices,
                message: 'Choose the manager: '
            }]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        continue;
                    }
                }
            }
            connection.query(
                `INSERT into employee SET ?`, {
                    first_name: addName.first,
                    last_name: addName.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();
                }
            );

        });
    });
}

function addDept() {
    inquirer.prompt({

        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {

        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if (err) return err;
            prompt();
        });


    });
}

function addRole() {
    let departmentArr = [];
    promisemysql.createConnection(connectionProperties)
        .then((connection) => {
            return connection.query('SELECT id, name FROM department ORDER BY name ASC');
        }).then((departments) => {

            for (i = 0; i < departments.length; i++) {
                departmentArr.push(departments[i].name);
            }
            return departments;
        }).then((departments) => {
            inquirer.prompt([{
                    name: "roleTitle",
                    type: "input",
                    message: "Role title: "
                },
                {
                    name: "salary",
                    type: "number",
                    message: "Salary: "
                },
                {
                    name: "dept",
                    type: "list",
                    message: "Department: ",
                    choices: departmentArr
                }
            ]).then((answer) => {

                let deptID;
                for (i = 0; i < departments.length; i++) {
                    if (answer.dept == departments[i].name) {
                        deptID = departments[i].id;
                    }
                }
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if (err) return err;
                    prompt();
                });
            });
        });
}

function enterId() {
    return ([{
        name: "name",
        type: "input",
        message: "Enter employee ID: "
    }]);
}

async function updateRole() {
    const employeeId = await inquirer.prompt(enterId());
    connection.query(`SELECT role.id, role.title FROM role ORDER BY role.id;`, async(err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([{
            name: 'role',
            type: 'list',
            choices: () => res.map(res => res.title),
            message: 'What is the new role?: '
        }]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async(err, res) => {
            if (err) throw err;
            prompt();
        });
    });
}

// async function deleteEmployee() {
//     const answer = await inquirer.prompt([{
//         name: "first",
//         type: "input",
//         message: "Enter the employee ID you'd like to remove: "
//     }]);
//     connection.query('DELETE FROM employee WHERE ?', {
//             id: answer.first
//         },
//         function(err) {
//             if (err) throw err;
//         }
//     )
// };


function viewDeptBudget() {
    promisemysql.createConnection(connectionProperties)
        .then((connection) => {
            return Promise.all([

                connection.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
                connection.query('SELECT name FROM department ORDER BY name ASC')
            ]);
        }).then(([deptSalaries, departments]) => {

            let deptBudgetArr = [];
            let department;


            for (d = 0; d < departments.length; d++) {
                let departmentBudget = 0;

                for (i = 0; i < deptSalaries.length; i++) {
                    if (departments[d].name == deptSalaries[i].department) {
                        departmentBudget += deptSalaries[i].salary;
                    }
                }
                department = {
                    Department: departments[d].name,
                    Budget: departmentBudget
                }
                deptBudgetArr.push(department);
            }


            prompt();
        });

}