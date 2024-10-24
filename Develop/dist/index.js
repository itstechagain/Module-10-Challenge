import inquirer from 'inquirer';
import logo from 'asciiart-logo';
import Db from './db/index.js';
const db = new Db();
init();
// Displays "Employees" text and loadMainPrompts()
function init() {
    const logoText = logo({ name: 'Employees' }).render();
    console.log(logoText);
    loadMainPrompts();
}
function loadMainPrompts() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES',
                },
                {
                    name: 'View All Employees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT',
                },
                {
                    name: 'View All Employees By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER',
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE',
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE',
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE',
                },
                {
                    name: 'Update Employee Manager',
                    value: 'UPDATE_EMPLOYEE_MANAGER',
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES',
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE',
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE',
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS',
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT',
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT',
                },
                {
                    name: 'View Total Utilized Budget By Department',
                    value: 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT',
                },
                {
                    name: 'Quit',
                    value: 'QUIT',
                },
            ],
        },
    ]).then((res) => {
        const choice = res.choice;
        // call corresponsing function
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            // Application allows users to view employees by department (2 points)
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                viewEmployeesByDepartment();
                break;
            // Application allows users to view employees by manager (2 points)
            case 'VIEW_EMPLOYEES_BY_MANAGER':
                viewEmployeesByManager();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            // Application allows users to delete employees (2 points)
            case 'REMOVE_EMPLOYEE':
                removeEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            // Application allows users to update employee managers (2 points)
            case 'UPDATE_EMPLOYEE_MANAGER':
                updateEmployeeManager();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            // Application allows users to delete departments (2 points)
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
                break;
            // Application allows users to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department (8 points)
            case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
                viewUtilizedBudgetByDepartment();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            // Application allows users to delete roles (2 points)
            case 'REMOVE_ROLE':
                removeRole();
                break;
            default:
                quit();
        }
    });
}
// viewEmployees()
function viewEmployees() {
    db.findAllEmployees()
        .then(({ rows }) => {
        const employees = rows;
        console.log('\n');
        console.table(employees);
    })
        .then(() => loadMainPrompts());
}
// viewEmployeesByDepartment() 
function viewEmployeesByDepartment() {
    db.findAllDepartments().then(({ rows }) => {
        const departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select a department to see employees.',
                choices: departmentChoices,
            },
        ])
            .then((res) => db.findAllEmployeesByDepartment(res.departmentId))
            .then(({ rows }) => {
            const employees = rows;
            console.log('\n');
            console.table(employees);
        })
            .then(() => loadMainPrompts());
    });
}
// viewEmployeesByManager()
function viewEmployeesByManager() {
    db.findAllEmployees().then(({ rows }) => {
        const managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Select an employee to see direct reports.',
                choices: managerChoices,
            },
        ])
            .then((res) => db.findAllEmployeesByManager(res.managerId))
            .then(({ rows }) => {
            const employees = rows;
            console.log('\n');
            if (employees.length === 0) {
                console.log('The selected employee has no managers');
            }
            else {
                console.table(employees);
            }
        })
            .then(() => loadMainPrompts());
    });
}
// removeEmployee()
function removeEmployee() {
    db.findAllEmployees().then(({ rows }) => {
        const employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select an employee to remove.',
                choices: employeeChoices,
            },
        ])
            .then((res) => db.removeEmployee(res.employeeId))
            .then(() => console.log('Removed employee from the database'))
            .then(() => loadMainPrompts());
    });
}
// updateEmployeeRole()
function updateEmployeeRole() {
    db.findAllEmployees().then(({ rows }) => {
        const employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Select an employee to update.",
                choices: employeeChoices,
            },
        ]).then((res) => {
            const employeeId = res.employeeId;
            db.findAllRoles().then(({ rows }) => {
                const roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Select a role to assign to the employee.',
                        choices: roleChoices,
                    },
                ])
                    .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
                    .then(() => console.log("Updated employee's role"))
                    .then(() => loadMainPrompts());
            });
        });
    });
}
// updateEmployeeManager()
function updateEmployeeManager() {
    db.findAllEmployees().then(({ rows }) => {
        const employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Select an employee to update.",
                choices: employeeChoices,
            },
        ]).then((res) => {
            const employeeId = res.employeeId;
            db.findAllPossibleManagers(employeeId).then(({ rows }) => {
                const managers = rows;
                const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id,
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'managerId',
                        message: 'Select a manager for the selected empoloyee',
                        choices: managerChoices,
                    },
                ])
                    .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
                    .then(() => console.log("Updated employee's manager"))
                    .then(() => loadMainPrompts());
            });
        });
    });
}
// viewRoles()
function viewRoles() {
    db.findAllRoles()
        .then(({ rows }) => {
        const roles = rows;
        console.log('\n');
        console.table(roles);
    })
        .then(() => loadMainPrompts());
}
// addRole()
function addRole() {
    db.findAllDepartments().then(({ rows }) => {
        const departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        inquirer.prompt([
            {
                name: 'title',
                message: 'Enter the name of the role.',
            },
            {
                name: 'salary',
                message: 'Enter the salary of the role.',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Enter the department of the role.',
                choices: departmentChoices,
            },
        ]).then((role) => {
            db.createRole(role)
                .then(() => console.log(`Added ${role.title} to the database`))
                .then(() => loadMainPrompts());
        });
    });
}
// removeRole()
function removeRole() {
    db.findAllRoles().then(({ rows }) => {
        const roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Choose a role to remove. (Warning: This removes all assosciated employees)',
                choices: roleChoices,
            },
        ])
            .then((res) => db.removeRole(res.roleId))
            .then(() => console.log('Removed role from the database'))
            .then(() => loadMainPrompts());
    });
}
// viewDepartments()
function viewDepartments() {
    db.findAllDepartments()
        .then(({ rows }) => {
        const departments = rows;
        console.log('\n');
        console.table(departments);
    })
        .then(() => loadMainPrompts());
}
// addDepartment()
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter the name of the department.',
        },
    ]).then((res) => {
        const name = res;
        db.createDepartment(name)
            .then(() => console.log(`Added ${name.name} to the database`))
            .then(() => loadMainPrompts());
    });
}
// removeDepartment()
function removeDepartment() {
    db.findAllDepartments().then(({ rows }) => {
        const departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Choose a department to remove. (Warning: This removes all associated roles and employees)',
            choices: departmentChoices,
        })
            .then((res) => db.removeDepartment(res.departmentId))
            .then(() => console.log(`Removed department from the database`))
            .then(() => loadMainPrompts());
    });
}
// viewUtilizedBudgetByDepartment()
function viewUtilizedBudgetByDepartment() {
    db.viewDepartmentBudgets()
        .then(({ rows }) => {
        const departments = rows;
        console.log('\n');
        console.table(departments);
    })
        .then(() => loadMainPrompts());
}
// addEmployee()
function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            message: "Enter the employee's first name.",
        },
        {
            name: 'last_name',
            message: "Enter the employee's last name.",
        },
    ]).then((res) => {
        const firstName = res.first_name;
        const lastName = res.last_name;
        db.findAllRoles().then(({ rows }) => {
            const roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id,
            }));
            inquirer.prompt({
                type: 'list',
                name: 'roleId',
                message: "Enter the employee's role.",
                choices: roleChoices,
            }).then((res) => {
                const roleId = res.roleId;
                db.findAllEmployees().then(({ rows }) => {
                    const employees = rows;
                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id,
                    }));
                    managerChoices.unshift({ name: 'None', value: null });
                    inquirer.prompt({
                        type: 'list',
                        name: 'managerId',
                        message: "Enter the employee's manager.",
                        choices: managerChoices,
                    })
                        .then((res) => {
                        const employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name: firstName,
                            last_name: lastName,
                        };
                        db.createEmployee(employee);
                    })
                        .then(() => console.log(`Added ${firstName} ${lastName} to the database`))
                        .then(() => loadMainPrompts());
                });
            });
        });
    });
}
// quit() quits the application
function quit() {
    console.log('Goodbye');
    process.exit();
}
