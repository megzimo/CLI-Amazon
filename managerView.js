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
    if (err) throw err;
    console.log("\n |-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~- Manager View -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-| \n");
    managerView();
    // connection checked and is working 10.22.18
    });

function managerView(){
    inquirer.prompt({
        name: "manager",
        type: "list",
        message: "\t Main Menu - What would you like to do? \n",
        choices: ["\t \t View Products for Sale", "\t \t View Low Inventory", "\t \t Add to Inventory", "\t \t Add New Product"]
    }).then(function(answer){
        switch(answer.manager){
            case "\t \t View Products for Sale":
                viewProducts();
                nextPrompt();
                break;
            case "\t \t View Low Inventory":
                viewLow();
                break;
            case "\t \t Add to Inventory":
                addInventory();
                break;
            case "\t \t Add New Product":
                newProduct();
                break;
        }
    })
}

////////////////////////////////////////////////// VIEW ALL PRODUCTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
            
            // instantiate
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 20, 20, 20, 20]
            });
            
            // loop through the response and print out each row into the table
            for (var i = 0; i < res.length; i++) {   
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, `$`+res[i].price, res[i].stock_quantity]
            );
        }; // ENDS for loop
    
        console.log("\n" + table.toString());
    });
};


////////////////////////////////////////////////// VIEW ITEMS OF LOW STOCK \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function viewLow(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response){
        if (err) throw err;
            // instantiate
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 20, 20, 20, 20]
            });
            
            // loop through the response and print out each row into the table
            for (var i = 0; i < response.length; i++) {   
            table.push(
                [response[i].item_id, response[i].product_name, response[i].department_name, `$`+response[i].price, response[i].stock_quantity]
            );
        }; // ENDS for loop
    
        console.log("\n" + table.toString() + "\n");
        nextPrompt();
    })
};

////////////////////////////////////////////////// ADD INVENTORY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function addInventory(){
    viewProducts();

    inquirer.prompt([{
        name: "item_add",
        type: "input",
        message: "Please provide the Item ID of the product you'd like to add inventory to:",
        validate: function(val){
            if(isNaN(val) === false){
                return true;
            } else {
                console.log("You did not provide an Item ID - please try again.");
                return false;
            }
        }
    },
    {
        name: "item_amount",
        type: "input",
        message: "How many would you like to add to the inventory?",
        validate: function(val){
            if(isNaN(val) === false){
                return true;
            } else {
                console.log("You did not provide an amount for restocking - please try again.")
            }
        }
    }]).then (function(answer){
        let updatedItemID = answer.item_add;
        console.log("updated item id: " + updatedItemID)

        connection.query("SELECT * FROM products WHERE ?", {item_id: updatedItemID}, function(err, res){
            if (err) throw err;
            let newInventory = parseInt(answer.item_amount) + parseInt(res[0].stock_quantity);
            let itemName = res[0].product_name;

            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newInventory
                },
                {
                    item_id: updatedItemID
                }
            ], function(err){
                    if (err) throw err;
                    console.log(`
                    You've added ${answer.item_amount} units to ${itemName}. The new stock amount for this item is ${newInventory}
                    `);
                    nextPrompt();
                }) // ENDS sql update

        }) // ENDS first sql query to find 

    }) // ENDS promise

} // ENDS addInventory()
      
////////////////////////////////////////////////// ADD NEW PRODUCT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function newProduct(){
    inquirer.prompt([{
        name: "new_item",
        type: "input",
        message: "\n To add an new item to inventory, please type in the name of the product below"
    },
    {
        name: "new_department",
        type: "input",
        message: "\n What department does this new item below to?" 
    },
    {
        name: "new_price",
        type: "input",
        message: "\n How much does one unit of this new item cost?",
        validate: function(val){
            if(isNaN(val) === false){
                return true;
            } else {
                console.log("Please provide a valid price for this item.")
                return false;
            }
        } 
    },
    {
        name: "new_quantity",
        type: "input",
        message: "\n How many units of this product would you like to add to the inventory?",
        validate: function(val){
            if(isNaN(val) === false){
                return true;
            } else {
                console.log("Please provide a valid price for this item.")
                return false;
            }
        }  
    }]).then(function(answer){
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.new_item,
            department_name: answer.new_department,
            price: answer.new_price,
            stock_quantity: answer.new_quantity
        }, function(err){
            if(err) throw err;
            console.log(`
            Congratulations! You've added ${answer.new_item} to your inventory!
            `);
            nextPrompt();
        })

    }) // ENDS promise

}; // ENDS newProduct


////////////////////////////////////////////////// INQUIRER TO HANDLE TASK SWITCH \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function nextPrompt(){
    inquirer.prompt({
        name: "next",
        type: "list",
        message: "\t What else would you like to do?",
        choices: ["\t \t View Main Menu", "\t \t Exit"]
    }).then(function(answer){
        switch(answer.next){
            case "\t \t View Main Menu":
                managerView();
                break;
            case "\t \t Exit":
                console.log("You've exited 'Manager View'. Have a great day - see you next time!");
                connection.end();
                break;
        }
    })
}
