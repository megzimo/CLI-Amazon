const inquirer = require ("inquirer");
const mysql = require ("mysql");
const Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    console.log("connected as id: " + connection.threadId);
    // connection checked and is working 10.22.18
    viewChoice()
})

  ///////////////////////////////////// Inquirer to load table/access supervisor choices \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  function viewChoice(){
    inquirer.prompt([{
        name: "view",
        type: "rawlist",
        message: "Welcome Supervisor! What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"]  
    }]).then(function (answer){
        console.log("choice: ", answer.view);
        switch(answer.view){
            case "View Product Sales by Department":
            supervisorView();
            break;
            
            case "Create New Department":
            newDept();
            break;
            case "Quit":
            console.log(`
            Thanks for keeping things up to date! Have a great day!
            `)
            connection.end();
            break;
        }
    });
  };

  //////////////////////////////////////////// Supervisor View - Inquirer \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// function supervisorView() {

// let productSales = `SELECT
//     departments.department_id AS "Department ID", 
//     departments.department_name AS "Department Name",
//     departments.over_head_costs AS "Overhead Costs", 
//     SUM(departments.product_sales) AS "Sales", 
//     SUM(departments.product_sales) - departments.over_head_costs AS "Profit"

//     FROM departments 

//     LEFT JOIN products ON products.department_name = departments.department_name
//     GROUP BY departments.department_id, departments.department_name, departments.over_head_costs;`;

// connection.query(productSales, function(err, res){
//     if(err) throw err;

//     var table = new Table({
//         head: ['Department ID', 'Department Name', 'Overhead Costs', 'Profit']
//     , colWidths: [10, 20, 20, 20]
//     });
  
//     // loop through the response and print out each row into the table
//     for (var i = 0; i < res.length; i++) {   
//     table.push(
//         [res[i].department_id, res[i].department_name, `$`+res[i].over_head_costs, `$`+res[i].total_profit]
//     );
// }; // ENDS for loop

// console.log("\n" + table.toString());

// })
// }; // ENDS supervisorView()



/////////////////////////////////////////// Inquirer to create new department \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  function newDept(){
    inquirer.prompt([{
        name: "new_dept",
        type: "input",
        message: "You have chosen to create a new department. What department would you like to create?"
    },{
        name: "overhead",
        type: "input",
        message: "What is the overhead cost of this department?",
        validate: function (input){
            if(isNaN(input)){
                console.log("Invalid number. Please try again.")
                return false;
            } else {
                return true;
            }
        }
    }]).then(function (answer){ 
        console.log("new department specs: ", answer)
        connection.query("INSERT INTO departments SET ?", {
            department_name: answer.new_dept,
            over_head_costs: answer.overhead
        });
        connection.query("INSERT INTO products SET ?", {
            department_name: answer.new_dept
        }, 
        function (err){
            console.log(`
            You have successfully added ${answer.new_dept} into your system.
            This department has an overhead cost of ${answer.overhead}.
            `)
            viewChoice();
        })
    });
  };

  