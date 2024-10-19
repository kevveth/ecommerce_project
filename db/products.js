const db = require("./index");

const findProductById = async (productId) => {
  try {
    const product = await db.query(
      "SELECT * FROM products WHERE product_id = $1",
      [productId]
    );
    return product;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createNewProduct = async ( name, description, price, imageUrl, categoryId ) => {
    try {
        const result = await db.query('INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5)  RETURNING *;', [name, description, price, imageUrl, categoryId]);
        
        // Returns the product created
        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}



module.exports = {
  findProductById,
  createNewProduct
};
