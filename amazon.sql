////////////////////////////////////////////////////////////// CUSTOMER VIEW \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price DECIMAL(65,2) NOT NULL,
    stock_quantity INT(100) NOT NULL
);

INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity)
VALUES ("1984", "books", 10.98, 63),
        ("Thermos", "kitchen", 10.50, 78),
        ("Ottoman", "furniture", 120.50, 90),
        ("Moonrise Kingdom", "movies", 15.99, 39),
        ("Yarm", "crafts", 5.99, 105),
        ("Headphones", "technology", 35.00, 28),
        ("Yoga Mat", "sports", 29.90, 170),
        ("Quilt - Queen", "home", 85.29, 70),
        ("Coffee Maker", "appliances", 15.99, 110),
        ("2019 Calendar", "home", 11.97, 56)
        ;



////////////////////////////////////////////////////////////// SUPERVISOR VIEW \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
DROP DATABASE IF EXISTS bamazon

USE bamazon;

CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INT(65) NOT NULL,
    product_sales INT(65),
    total_profits INT(65)
);

INSERT INTO bamazon.departments(department_name, over_head_costs)
VALUES("books", 870),
    ("kitchen", 2500),
    ("furniture", 5000),
    ("movies", 800),
    ("crafts", 500),
    ("technology", 1250),
    ("sports", 975),
    ("home", 1125),
    ("appliances", 2295)