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
    readProducts();
})

function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
        const Table = require('cli-table');
        
        // instantiate
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity']
        , colWidths: [10, 20, 20, 20, 20]
        });
      
        // loop through the response and print out each row into the table
        for (var i = 0; i < res.length; i++) {   
        table.push(
            [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
        );
    
    }; // ENDS for loop

    console.log(table.toString());

    }); // ENDS resonse

  }; // ENDS readProducts()

// inquirer to buy: product id and then quanity
    // if not enough --> insufficient quanitity

// update table   
