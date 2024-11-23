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