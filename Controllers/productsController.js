const db = require("../db/index");
const CustomError = require("../utils/CustomErrorHandler");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");

const table = 'products';

// GET /products?category={categoryId} - Get all products, optionally filtered by category
const getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const categoryId = req.query.category;

    let query = "SELECT * FROM " + table;
    const values = [];

    if (categoryId) {
      query += " WHERE category_id = $1";
      values.push(categoryId);
    }

    const products = await db.query(query, values);
    res.status(200).json({
      status: 'success',
      data: {
        products: products.rows
      }
    })
})

const findProductById = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await db.query(
    "SELECT * FROM products WHERE product_id = $1",
    [productId]
  );
  if (product.rows.length === 0) {
    const error = new CustomError("Product not found", 404)
    return next(error);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: product.rows[0]
    }
  })
});

const createNewProduct = asyncErrorHandler(async (req, res, next) => {
  const { name, description, price, image_url, category_id } = req.body;

  // Input validation
  if (!name || !description || !price || !image_url || !category_id) {
    const error = new CustomError("Missing required fields", 400);
    return next(error);
  }

  const newProduct = await db.query(
    "INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5)  RETURNING *;",
    [name, description, price, image_url, category_id]
  );

  res.status(201).json({
    status: "success",
    data: {
      newProduct: newProduct.rows[0],
    },
  });
});

module.exports = {
  getAllProducts,
  findProductById,
  createNewProduct,
};
