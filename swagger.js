// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'A simple ecommerce API with Swagger documentation',
    },
    components: {
        schemas: {
            User: {
                type: "object",
                properties: {
                  user_id: { type: "integer", readOnly: true },
                  username: { type: "string", example: "johndoe123" },
                  email: { type: "string", format: "email", example: "john.doe@example.com" },
                  password: { type: "string" },
                  street_address: { type: "string", example: "123 Main St" },
                  city: { type: "string", example: "Anytown" },
                  state: { type: "string", example: "CA" },
                  zip_code: { type: "integer", example: 12345 },
                },
                required: ["username", "email", "password"], 
              },
              Category: {
                type: "object",
                properties: {
                  category_id: { type: "integer", readOnly: true },
                  name: { type: "string" },
                },
                required: ["name"],
              },
              Cart: {
                type: "object",
                properties: {
                  cart_id: { type: "integer", readOnly: true },
                  user_id: { type: "integer" },
                  // ... other properties you might have in your Cart model (e.g., created_at)
                },
                required: ["cart_id", "user_id"],
              },
              CartItem: {
                type: "object",
                properties: {
                  cart_item_id: { type: "integer", readOnly: true },
                  cart_id: { type: "integer" },
                  product_id: { type: "integer" },
                  quantity: { type: "integer" },
                  // ... other properties you might have in your CartItem model (e.g., price)
                },
                required: ["cart_item_id", "cart_id", "product_id", "quantity"],
              },
              Product: {
                type: "object",
                properties: {
                  product_id: { type: "integer", readOnly: true },
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number", format: "float" },
                  image_url: { type: "string", format: "url" }, 
                  category_id: { type: "integer" }
                },
                required: ["name", "price"], // Assuming these are required
              },
              Order: {
                type: "object",
                properties: {
                  order_id: { type: "integer", readOnly: true },
                  user_id: { type: "integer" },
                  order_date: { type: "string", format: "date-time" },
                  total_amount: { type: "number", format: "float" },
                },
                required: ["user_id", "total_amount"],
              },
              OrderItem: {
                type: "object",
                properties: {
                  order_item_id: { type: "integer", readOnly: true },
                  order_id: { type: "integer" },
                  product_id: { type: "integer" },
                  quantity: { type: "integer" },
                  price: { type: "number", format: "float" },
                },
                required: ["order_id", "product_id", "quantity", "price"],
              },
              Checkout: {
                type: "object",
                properties: {
                  checkout_id: { type: "integer", readOnly: true },
                  user_id: { type: "integer" },
                  checkout_date: { type: "string", format: "date-time" },
                  total_amount: { type: "number", format: "float" },
                },
                required: ["user_id", "total_amount"],
              },
        }

    }
  },
  apis: ['./routes/*.js'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};