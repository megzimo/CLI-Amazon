# CLI-Amazon

An Amazon-like store utilizing MySQL as a database to display product data via Node in the Terminal.


## User Guide
Below you will find detailed instructions on how to run each version of the CLI-Amazon app.

### Customer View
1. When you run the CLI-Amazon, the application will first prompt you to select a product to purchase by typing in the product id.
2. After typing in and submitting the product id, you will be prompted to specify the amount you would like to purchase. If the amount submitted exceeds the stock listed in the table, you will receive a message stating `Insufficient quantity! Please input a value less than or equal to the quantity available in stock`
3. After you successfully choose a valid amount of that item to purchase, you will receive a notification informing you `Your pruchase has been successfully processed! The total cost of your purchase was $_____`.
4. Finally, the table will be reprinted to the terminal with updated stock amounts, and you will be prompted again to choose an item to purchase.

### Manager View
1. 
2. 
3. 

### Supervisor View
1. 
2. 
3. 


## Packages Utilized

To use this application, download the following packages through https://www.npmjs.com/:
* mysql
* inquirer
* CLI-table
