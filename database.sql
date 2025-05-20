-- Create database
CREATE DATABASE la_surtidora;

-- Connect to the database
\c la_surtidora;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create product_categories table (for many-to-many relationship)
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(id),
    category_id INTEGER REFERENCES categories(id),
    PRIMARY KEY (product_id, category_id)
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL
);

-- Create cart table
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
    ('Electrónicos', 'Productos electrónicos y gadgets'),
    ('Hogar', 'Artículos para el hogar'),
    ('Ropa', 'Ropa y accesorios'),
    ('Alimentos', 'Productos alimenticios');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, stock, rating) VALUES
    ('Laptop Pro X', 'Laptop de alta gama para profesionales', 1299.99, 'assets/product1.jpg', 10, 4.5),
    ('Smartphone Ultra', 'Último modelo de smartphone', 899.99, 'assets/product2.jpg', 15, 5.0),
    ('Smart Watch Series 5', 'Reloj inteligente con múltiples funciones', 299.99, 'assets/product3.jpg', 20, 4.0),
    ('Wireless Earbuds Pro', 'Audífonos inalámbricos de alta calidad', 199.99, 'assets/product4.jpg', 25, 4.7),
    ('4K Smart TV 55"', 'Televisor inteligente 4K', 799.99, 'assets/product5.jpg', 8, 4.9),
    ('Gaming Console Pro', 'Consola de videojuegos de última generación', 499.99, 'assets/product6.jpg', 12, 4.6),
    ('Digital Camera HD', 'Cámara digital de alta resolución', 349.99, 'assets/product7.jpg', 15, 4.2),
    ('Tablet Ultra', 'Tablet de alta gama', 599.99, 'assets/product8.jpg', 18, 4.8),
    ('Smart Speaker AI', 'Altavoz inteligente con asistente virtual', 129.99, 'assets/product9.jpg', 30, 4.1),
    ('Wireless Router Pro', 'Router inalámbrico de alta velocidad', 149.99, 'assets/product10.jpg', 22, 4.5);

-- Assign products to categories
INSERT INTO product_categories (product_id, category_id) VALUES
    (1, 1), -- Laptop Pro X -> Electrónicos
    (2, 1), -- Smartphone Ultra -> Electrónicos
    (3, 1), -- Smart Watch Series 5 -> Electrónicos
    (4, 1), -- Wireless Earbuds Pro -> Electrónicos
    (5, 1), -- 4K Smart TV -> Electrónicos
    (6, 1), -- Gaming Console Pro -> Electrónicos
    (7, 1), -- Digital Camera HD -> Electrónicos
    (8, 1), -- Tablet Ultra -> Electrónicos
    (9, 1), -- Smart Speaker AI -> Electrónicos
    (10, 1); -- Wireless Router Pro -> Electrónicos 