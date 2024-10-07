const express = require('express');
const db = require('./db'); // Import the database module
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.port || 3000; 

app.get('/',(request,response)=>{
    response.send('Welcome to our simple online ecommerce web app!');
   });

app.use('/users', usersRouter);

app.get('/products', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM products');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching products');
    }
  });
  
  app.get('/carts', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM carts');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching carts');
    }
  });
  
  app.get('/cart_items', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM cart_items');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching cart items');
    }
  });
  
  app.get('/orders', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM orders');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching orders');
    }
  });
  
  app.get('/order_items', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM order_items');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching order items');
    }
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});