const db = require('./index')

const fetchProductById = async (product_id) => {
    const product = await db.query("SELECT * FROM products WHERE product_id = $1", [product_id]);
    return product.rows[0];
}

module.exports = {
    fetchProductById
}