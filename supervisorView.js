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
    supervisorView();
})

function supervisorView() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
        const Table = require('cli-table');
        
        // instantiate
        var supervisor_table = new Table({
            head: ['Department ID', 'Department Name', 'Over Head Costs']
        , colWidths: [20, 25, 25]
        });
      
        // loop through the response and print out each row into the table
        for (var i = 0; i < res.length; i++) {   
            supervisor_table.push(
            [res[i].department_id, res[i].department_name, `$`+res[i].over_head_costs]
        );
    }; // ENDS for loop

    console.log("\n" + supervisor_table.toString());

    }); // ENDS response
  }; // ENDS readProducts()
