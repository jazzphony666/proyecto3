require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// API Routes

// User Authentication Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        
        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const result = await pool.query(
            'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, address',
            [name, email, hashedPassword, phone, address]
        );
        
        const user = result.rows[0];
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const result = await pool.query(
            'SELECT id, name, email, password, phone, address FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = result.rows[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, phone, address, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        const result = await pool.query(
            'UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING id, name, email, phone, address',
            [name, phone, address, req.user.userId]
        );
        
        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Product Routes

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
app.post('/api/orders', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const { items } = req.body;
        const user_id = req.user.userId;
        
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
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
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
app.post('/api/cart/items', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userId;
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
app.put('/api/cart/items/:productId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
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
app.delete('/api/cart/items/:productId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        
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