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
    // console.log("connected as id: " + connection.threadId);
    console.log("\n |-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~- Welcome to Bamazon! -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-| ");
    readProducts();
    });

////////////////////////////////////////////// inquirer: product id and then quanity purchased \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    function welcomePurchase(){
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "What item would you like to purchase? Enter the Item ID to continue",
            validate: function(input){
                if(isNaN(input) === false){
                    return true;
                } else {
                    console.log("Invalid Item ID. Please try again.")
                    return false;
                }
            }
        },
        {
            name: "amount",
            type: "input",
            message: "How many would do you wish to purchase?",
            validate: function(input){
                if(isNaN(input) === false){
                    return true;
                } else {
                    console.log("Invalid quantity. Please try again.")
                    return false;
                }
            }   
        }]).then(function (customerSelect){
            
            // connect to database based on customer item and quantity selection
            query = connection.query ("SELECT * FROM products WHERE item_id=?", customerSelect.item, function (err, res){
                if (err) throw err;
                // console.log("affected rows: ", res.length)
                if(customerSelect.amount > res.stock_quantity){
                    console.log("Insufficient quantity! Please input a value less than or equal to the quantity available in stock");
                    return;
                }
                if (!res){
                    console.log("Oops! It looks like you did not select a product. Please select an item listen by typing in the corresponding Item ID")
                }

        //////////////////////////////////////// Update table after purchase and print \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: (res[0].stock_quantity - customerSelect.amount)
                    },
                    {
                        item_id: customerSelect.item
                    }
                ], function(err, res) {
                        if(customerSelect.amount == 0){
                        console.log("\n \t Oops, you did not provide a valid number to purchase! \n");
                        welcomePurchase();
                    } else {
                        console.log(`
                        You've successfully purchased ${customerSelect.amount} units of Item ID: ${customerSelect.item}!
                        `);
                    nextPrompt();
                    }
                }); 
            });
        });
    };
////////////////////////////////////////////////// Prints store inventory table \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
        
        // instantiate
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price']
        , colWidths: [10, 20, 20]
        });
      
        // loop through the response and print out each row into the table
        for (var i = 0; i < res.length; i++) {   
        table.push(
            [res[i].item_id, res[i].product_name, `$`+res[i].price]
        );
    }; // ENDS for loop

    console.log("\n" + table.toString());
    welcomePurchase();

    }); // ENDS response
}; // ENDS readProducts()


function nextPrompt(){
    inquirer.prompt({
        name: "next",
        type: "list",
        message: "\n \t What else would you like to do?",
        choices: ["\t \t Make another purchase", "\t \t Exit"]
    }).then(function(answer){
        switch(answer.next){
            case "\t \t Make another purchase":
                welcomePurchase();
                break;
            case "\t \t Exit":
                console.log("\n Thanks for shopping with Bamazon - see you next time! \n");
                connection.end();
                break;
        }
    })

}