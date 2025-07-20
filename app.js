const express = require('express');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error occured while retrieving products' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error occured while retrieving products' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(200).json({ message: 'Product retrieved successfully', data: results });
            }
        }
    });
});

app.get('/products/search/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    const sql = 'SELECT * FROM products WHERE name LIKE ?';
    db.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error occured while retrieving products' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});