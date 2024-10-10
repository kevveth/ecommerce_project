const express = require('express'),
        passport = require('passport'),
        LocalStrategy = require('passport-local').LocalStrategy,
        bcrypt = require('bcrypt'),
        db = require('./db'); // Import the database module

const usersRouter = require('./routes/users'),
        productsRouter = require('./routes/products'),
        ordersRouter = require('./routes/orders'),
        orderItemsRouter = require('./routes/order_items'),
        cartsRouter = require('./routes/carts'),
        cartItemsRouter = require('./routes/cart_items');

const app = express();
const port = process.env.port || 3000; 

app.use(express.json());

app.get('/',(request,response)=>{
    response.send('Welcome to our simple online ecommerce web app!');
   });

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/order_items', orderItemsRouter);
app.use('/carts', cartsRouter);
app.use('/cart_items', cartItemsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});