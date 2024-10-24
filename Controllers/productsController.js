const db = require("../db/index");
const CustomError = require("../utils/CustomErrorHandler");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");

const table = "products";

/**
 * Retrieves all products, optionally filtered by category ID.
 *
 * @returns {Object} 200 - A JSON response with an array of product objects
 * @returns {Object} 500 - An error message indicating failure to fetch products
 */
const getAllProducts = asyncErrorHandler(async (req, res) => {
  // Extract the category ID from the query parameters
  const categoryId = req.query.category;

  // Build the base SQL query
  let query = "SELECT * FROM " + table;
  const values = [];

  // Add a WHERE clause if a category ID is provided
  if (categoryId) {
    query += " WHERE category_id = $1";
    values.push(categoryId);
  }

  // Execute the query to fetch products from the database
  const products = await db.query(query, values);

  // Send a 200 OK response with the fetched products
  res.status(200).json({
    status: "success",
    data: {
      products: products.rows,
    },
  });
});

/**
 * Retrieves a single product by its unique ID.
 *
 * @returns {Object} 200 - A JSON response with the product object
 * @returns {Object} 404 - A JSON response with a "Product not found" message
 */
const findProductById = asyncErrorHandler(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;

  // Fetch the product from the database based on the provided ID
  const product = await db.query(
    "SELECT * FROM products WHERE product_id = $1",
    [productId],
  );

  // If no product is found, throw a custom 404 error
  if (product.rows.length === 0) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }

  // Send a 200 OK response with the fetched product
  res.status(200).json({
    status: "success",
    data: {
      product: product.rows[0],
    },
  });
});

/**
 * Creates a new product in the database.
 *
 * @returns {Object} 201 - A JSON response with the newly created product object
 * @returns {Object} 400 - A JSON response with a "Missing required fields" message
 */
const createNewProduct = asyncErrorHandler(async (req, res, next) => {
  // Destructure the required fields from the request body
  const { name, description, price, image_url, category_id } = req.body;

  // Input validation: Check if any of the required fields are missing
  if (!name || !description || !price || !image_url || !category_id) {
    // If any fields are missing, throw a custom error with a 400 status code
    const error = new CustomError("Missing required fields", 400);
    return next(error);
  }

  // Insert the new product into the database
  const newProduct = await db.query(
    "INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5)  RETURNING *;",
    [name, description, price, image_url, category_id],
  );

  // Send a 201 Created response with the newly created product data
  res.status(201).json({
    status: "success",
    data: {
      newProduct: newProduct.rows[0],
    },
  });
});

/**
 * Update an existing product.
 *
 * @returns {Object} 200 - A JSON response with the updated product object
 * @returns {Object} 404 - A JSON response with a "Product not found" message
 * @returns {Object} 500 - An error message indicating failure to update the product
 */
const updateProduct = asyncErrorHandler(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;

  // Extract the properties to be updated from the request body
  const updates = req.body;

  // Build the SET clause dynamically, filtering out undefined values
  const setClause = Object.keys(updates)
    .filter((field) => updates[field] !== undefined)
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  // Construct the SQL UPDATE query
  const query = `UPDATE ${table} SET ${setClause} WHERE product_id = $${
    Object.keys(updates).length + 1
  } RETURNING *`;

  // Prepare the values for the parameterized query
  const values = [...Object.values(updates), productId];

  // Execute the query to update the product in the database
  const result = await db.query(query, values);

  // If the product is not found, throw a custom 404 error
  if (result.rowCount === 0) {
    const error = new CustomError("Product not found.", 404);
    return next(error);
  }

  // Send a 200 OK response with the updated product data
  res.status(200).json({
    status: "success",
    data: {
      updatedProduct: {
        ...result.rows[0],
        price: parseFloat(result.rows[0].price), // Convert price to a number
      },
    },
  });
});

/**
 * Delete a product from the database.
 *
 * @returns {Object} 204 - A success response with no content
 * @returns {Object} 404 - A JSON response with a "Product not found" message
 * @returns {Object} 500 - An error message indicating failure to delete the product
 */
const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  // Extract the product ID from the request parameters and convert it to a number
  const productId = parseInt(req.params.id);

  // Execute the query to delete the product from the database
  const result = await db.query(
    "DELETE FROM products WHERE product_id = $1",
    [productId],
  );

  // If no product was found with the given ID, throw a custom 404 error
  if (result.rowCount === 0) {
    const error = new CustomError("Product not found.", 404);
    return next(error);
  }

  // Send a 204 No Content response to indicate successful deletion
  res.status(204).json({
    status: "success",
    data: {},
  });
});

module.exports = {
  getAllProducts,
  findProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
};