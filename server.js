require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get products by category
app.get('/api/categories/:categoryId/products', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const result = await pool.query(`
            SELECT p.* 
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            WHERE pc.category_id = $1
        `, [categoryId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    const client = await pool.connect();
    try {
        const { user_id, items } = req.body;
        
        await client.query('BEGIN');
        
        // Create order
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id',
            [user_id, items.reduce((sum, item) => sum + (item.price * item.quantity), 0)]
        );
        
        const orderId = orderResult.rows[0].id;
        
        // Add order items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            // Update product stock
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }
        
        await client.query('COMMIT');
        res.json({ order_id: orderId, message: 'Order created successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Cart API Routes

// Get user's cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get or create cart
        let cartResult = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );
        
        let cart;
        if (cartResult.rows.length === 0) {
            cartResult = await pool.query(
                'INSERT INTO cart (user_id) VALUES ($1) RETURNING *',
                [userId]
            );
            cart = cartResult.rows[0];
        } else {
            cart = cartResult.rows[0];
        }
        
        // Get cart items with product details
        const itemsResult = await pool.query(`
            SELECT ci.*, p.name, p.price, p.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1
        `, [cart.id]);
        
        res.json({
            cart_id: cart.id,
            items: itemsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add item to cart
app.post('/api/cart/:userId/items', async (req, res) => {
    const client = await pool.connect();
    try {
        const { userId } = req.params;
        const { product_id, quantity } = req.body;
        
        await client.query('BEGIN');
        
        // Get or create cart
        let cartResult = await client.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );
        
        let cart;
        if (cartResult.rows.length === 0) {
            cartResult = await client.query(
                'INSERT INTO cart (user_id) VALUES ($1) RETURNING *',
                [userId]
            );
            cart = cartResult.rows[0];
        } else {
            cart = cartResult.rows[0];
        }
        
        // Check if item already exists in cart
        const existingItem = await client.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cart.id, product_id]
        );
        
        if (existingItem.rows.length > 0) {
            // Update quantity if item exists
            await client.query(
                'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE cart_id = $2 AND product_id = $3',
                [quantity, cart.id, product_id]
            );
        } else {
            // Add new item
            await client.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
                [cart.id, product_id, quantity]
            );
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Item added to cart successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Update cart item quantity
app.put('/api/cart/:userId/items/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        
        const result = await pool.query(`
            UPDATE cart_items ci
            SET quantity = $1, updated_at = CURRENT_TIMESTAMP
            FROM cart c
            WHERE ci.cart_id = c.id
            AND c.user_id = $2
            AND ci.product_id = $3
            RETURNING ci.*
        `, [quantity, userId, productId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove item from cart
app.delete('/api/cart/:userId/items/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        const result = await pool.query(`
            DELETE FROM cart_items ci
            USING cart c
            WHERE ci.cart_id = c.id
            AND c.user_id = $1
            AND ci.product_id = $2
            RETURNING ci.*
        `, [userId, productId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        
        res.json({ message: 'Item removed from cart successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 