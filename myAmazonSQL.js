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
    welcomePurchase();

})

////////////////////////////////////////////// inquirer: product id and then quanity purchased \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    function welcomePurchase(){
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "What item would you like to purchase?",
        },
        {
            name: "amount",
            type: "input",
            message: "How many would do you wish to purchase?"   
        }]).then(function (customerSelect){
            console.log(customerSelect);
            let query = connection.query ("SELECT * FROM products WHERE item_id=?", customerSelect.item, function (err, res){
                if (err) throw err;
                console.log(res);
                updateDB();
            // let query2 = connection.query("UPDATE products SET ? WHERE ?", [
            //     {
            //         stock_quantity: res[0].amount - customerSelect.amount
            //     },
            //     {
            //         id: customerSelect.item_id
            //     }
            // ]);
            // console.log("updated quantity: ");


                readProducts();
                if (!res){
                    console.log("Oops! It looks like you did not select a valid product. Please select an item listen by typing in the corresponding Item ID")
                };
            });
        });
    };

////////////////////////////////////////////////// Prints store inventory table \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
            [res[i].item_id, res[i].product_name, res[i].department_name, `$`+res[i].price, res[i].stock_quantity]
        );
    }; // ENDS for loop

    console.log("\n" + table.toString());

    }); // ENDS response
  }; // ENDS readProducts()


////////////////////////////////////////////////// Update Table \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function updateDB(customerSelect){
    let customerAmount = customerSelect.amount
    console.log(customerAmount);
    connection.query("UPDATE products SET ? WHERE ?", function(err, res) {[
        {
            stock_quantity: stock_quantity - customerSelect.amount
        },
        {
            id: customerSelect.item_id
        }
    ]});
    console.log("updated quantity: ", stock_quantity);
}; // ENDS updateDB()