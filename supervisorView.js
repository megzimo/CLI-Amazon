const inquirer = require ("inquirer");
const mysql = require ("mysql");

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
        choices: ["View Product Sales by Department", "Create New Department"]  
    }]).then(function (answer){
        console.log("choice: ", answer.view);
        switch(answer.view){
            case "View Product Sales by Department":
            supervisorView();
            break;
            
            case "Create New Department":
            newDept();
            break;
        }
    });
  };

  //////////////////////////////////////////// Supervisor View - Inquirer \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  function supervisorView() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
        const Table = require('cli-table');
        
        // instantiate
        var supervisor_table = new Table({
            head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profits']
        , colWidths: [20, 20, 20, 20 , 20]
        });
      
        // loop through the response and print out each row into the table
        for (var i = 0; i < res.length; i++) {   
            supervisor_table.push(
            [res[i].department_id, res[i].department_name, `$`+res[i].over_head_costs]
        );
    }; // ENDS for loop

    console.log("\n" + supervisor_table.toString());

    }); // ENDS response
  }; // ENDS supervisorView()



  ///////////////////////////////////// Update table after new department created \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//   connection.query("UPDATE products SET ? WHERE ?", [
//     {
//         stock_quantity: (res[0].stock_quantity - customerSelect.amount)
//     },
//     {
//         item_id: customerSelect.item
//     }
// ], function(err, res) {
//     console.log(res.affectedRows + " products updated!\n");
// }); 


// total sales % price of item to calculte total number sold

  /////////////////////////////////////////// Inquirer to create new department \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  function newDept(){
    inquirer.prompt([{
        name: "createNew",
        type: "input",
        message: "You have chosen to create a new department. What department would you like to create?"
    },{
        name: "overhead",
        type: "input",
        message: "What is the overhead cost of this department?"
    }]).then(function (answer){ 
        console.log("new department specs: ", answer)
  });
}; // ENDS newDept()
